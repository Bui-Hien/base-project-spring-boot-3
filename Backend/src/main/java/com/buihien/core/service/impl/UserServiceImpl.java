package com.buihien.core.service.impl;

import com.buihien.core.domain.security.User;
import com.buihien.core.dto.search.UserSearchDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.exception.ConflictException;
import com.buihien.core.exception.InvalidDataException;
import com.buihien.core.exception.NotFoundException;
import com.buihien.core.exception.UnauthorizedException;
import com.buihien.core.generic.GenericServiceImpl;
import com.buihien.core.repository.UserRepository;
import com.buihien.core.service.GroupUserService;
import com.buihien.core.service.UserPermissionService;
import com.buihien.core.service.UserRoleService;
import com.buihien.core.service.UserService;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.buihien.core.CoreConstants.SYSTEM_ADMIN;
import static com.buihien.core.util.CacheUtils.HashCachePermission;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, UserDto, UserSearchDto>
        implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRoleService userRoleService;
    @Autowired
    private GroupUserService groupUserService;
    @Autowired
    private UserPermissionService userPermissionService;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected UserDto convertToDto(User entity) {
        return new UserDto(entity, true);
    }

    @Override
    public UserDto saveOrUpdate(UserDto dto) {
        if (dto == null) return null;
        User entity = null;
        if (dto.getId() != null) {
            entity = userRepository.findById(dto.getId()).orElse(null);
        }
        if (entity == null) {
            entity = new User();
            if (dto.getPassword() == null || !StringUtils.hasText(dto.getPassword())) {
                throw new InvalidDataException("Mật khẩu là trường bắt buộc");
            }
            if (!dto.getPassword().equals(dto.getConfirmPassword())) {
                throw new InvalidDataException("Mật khẩu xác nhận không khớp");
            }
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        entity.setAccountNonExpired(dto.getAccountNonExpired());
        entity.setIsAccountNonLocked(dto.getIsAccountNonLocked());
        entity.setCredentialsNonExpired(dto.getCredentialsNonExpired());
        entity.setIsEnabled(dto.getIsEnabled());
        entity.setIsActive(dto.getIsActive());

        if (dto.getUsername() == null || !StringUtils.hasText(dto.getUsername().strip())) {
            throw new InvalidDataException("Username không được để trống.");
        }
        if (userRepository.existsByUsername(dto.getUsername().strip(), entity.getId())) {
            throw new ConflictException("Email đã được dùng để đăng ký tài khoản.");
        }

        entity.setUsername(dto.getUsername().strip().toLowerCase());
        if (dto.getPassword() != null && !StringUtils.hasText(dto.getPassword().strip())) {
            if (!dto.getPassword().equals(dto.getConfirmPassword())) {
                throw new InvalidDataException("Mật khẩu xác nhận không khớp");
            }
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRoleService.handleSetRoleForUser(dto, entity);
        groupUserService.handleSetGroupForUser(dto, entity);
        userPermissionService.handleSetPermissionForUser(dto, entity);
        entity = userRepository.save(entity);

        String username = entity.getUsername();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                HashCachePermission.remove(username);
            }
        });
        return convertToDto(entity);
    }

    @Override
    public UserDto getByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng " + username));
        return convertToDto(user);
    }

    @Override
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy user: " + username));
            loadPermission(user);
            return user;
        };
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        if (id == null) return;

        String username = userRepository.findUseNameById(id).orElse(null);
        if (username == null) {
            throw new NotFoundException("Không tìm thấy người dùng.");
        }

        super.deleteById(id);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                HashCachePermission.remove(username);
            }
        });
    }

    @Override
    @Transactional
    public int deleteMultiple(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        List<String> usernames = userRepository.findUseNamesByIds(ids).orElse(null);
        if (usernames == null || usernames.isEmpty()) {
            return 0;
        }

        // Delete trước
        int deleted = super.deleteMultiple(ids);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                HashCachePermission.removes(usernames);
            }
        });

        return deleted;
    }

    @Override
    public UserDto getCurrentUserDtoNonException() {
        User currentUser = getCurrentUserNonException();
        if (currentUser == null) {
            return null;
        }
        return new UserDto(currentUser, false);
    }

    @Override
    public UserDto getCurrentUserDto() {
        UserDto userDto = this.getCurrentUserDtoNonException();
        if (userDto == null) {
            throw new UnauthorizedException("Bạn chưa đăng nhập");
        }
        return userDto;
    }

    @Override
    public User getCurrentUserNonException() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User contextUser) {
            try {
                loadPermission(contextUser);
                return contextUser;
            } catch (Exception e) {
                log.error("Failed to reload permissions for current user", e);
                return contextUser; // fallback
            }
        }
        return null;
    }

    private void loadPermission(User user) {

        Set<String> permissionNames = HashCachePermission.get(user.getUsername());

        if (permissionNames == null) {
            log.info("load permissions for current user: " + user.getUsername());
            permissionNames = new HashSet<>(userRepository.findAllPermissionsNative(user.getUsername()));
        }

        permissionNames = permissionNames.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .collect(Collectors.toSet());

        if (userRepository.countUserByPermissionUserName(SYSTEM_ADMIN, user.getUsername()) > 0) {
            permissionNames.add(SYSTEM_ADMIN);
        }

        HashCachePermission.put(user.getUsername(), permissionNames);

        Set<GrantedAuthority> authorities = permissionNames.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        user.setAuthorities(authorities);
    }


    @Override
    public User getCurrentUser() {
        User currentUser = this.getCurrentUserNonException();
        if (currentUser == null) {
            throw new UnauthorizedException("Bạn chưa đăng nhập");
        }
        return currentUser;
    }

    @Override
    public List<String> getCurrentUserPermissions() {
        User user = getCurrentUser();
        if (user == null) {
            return List.of(); // Trả về empty list nếu user null (chưa đăng nhập)
        }
        this.loadPermission(user);

        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    @Override
    public Page<UserDto> pagingSearch(UserSearchDto dto) {
        int pageIndex = (dto.getPageIndex() == null || dto.getPageIndex() < 1) ? 0 : dto.getPageIndex() - 1;
        int pageSize = (dto.getPageSize() == null || dto.getPageSize() < 10) ? 10 : dto.getPageSize();

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(entity.id) FROM User entity WHERE (1=1) ");
        StringBuilder sql = new StringBuilder("SELECT new com.buihien.core.dto.security.UserDto(entity, true) FROM User entity WHERE (1=1) ");

        sql.append(builderWhereClause(dto));
        sqlCount.append(builderWhereClause(dto));

        TypedQuery<UserDto> q = manager.createQuery(sql.toString(), UserDto.class);
        TypedQuery<Long> qCount = manager.createQuery(sqlCount.toString(), Long.class);

        setParameter(q, dto);
        setParameter(qCount, dto);

        q.setFirstResult(pageIndex * pageSize);
        q.setMaxResults(pageSize);

        return new PageImpl<>(q.getResultList(), PageRequest.of(pageIndex, pageSize), qCount.getSingleResult());
    }

    @Override
    public void setParameter(Query query, UserSearchDto dto) {
        if (query == null) return;

        if (dto.getKeyword() != null && StringUtils.hasText(dto.getKeyword())) {
            query.setParameter("text", '%' + dto.getKeyword() + '%');
        }
        if (dto.getFromDate() != null) {
            query.setParameter("fromDate", dto.getFromDate());
        }
        if (dto.getToDate() != null) {
            query.setParameter("toDate", dto.getToDate());
        }
    }

    @Override
    public StringBuilder builderWhereClause(UserSearchDto dto) {
        StringBuilder whereClause = new StringBuilder();

        if (dto.getVoided() == null || !dto.getVoided()) {
            whereClause.append(" AND entity.voided = false ");
        } else {
            whereClause.append(" AND entity.voided = true ");
        }

        if (dto.getKeyword() != null && StringUtils.hasText(dto.getKeyword())) {
            whereClause.append(" AND (LOWER(entity.username) LIKE LOWER(:text)) ");
        }

        if (dto.getFromDate() != null) {
            whereClause.append(" AND entity.createDate >= :fromDate ");
        }
        if (dto.getToDate() != null) {
            whereClause.append(" AND entity.createDate <= :toDate ");
        }
        whereClause.append(dto.getOrderBy() != null && dto.getOrderBy() ? " ORDER BY entity.createdAt ASC" : " ORDER BY entity.createdAt DESC");

        return whereClause;
    }
}