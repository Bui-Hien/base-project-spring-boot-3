package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Role;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.dto.security.RoleDto;
import com.buihien.core.event.PermissionChangedEvent;
import com.buihien.core.generic.GenericServiceImpl;
import com.buihien.core.repository.UserRepository;
import com.buihien.core.service.RolePermissionService;
import com.buihien.core.service.RoleService;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static com.buihien.core.CoreConstants.REMOVE_CHANGE_TYPE;
import static com.buihien.core.CoreConstants.UPDATE_CHANGE_TYPE;

@Service
public class RoleServiceImpl extends GenericServiceImpl<Role, RoleDto, SearchDto> implements RoleService {

    private static final Logger log = LoggerFactory.getLogger(RoleServiceImpl.class);

    @Autowired
    private RolePermissionService rolePermissionService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected RoleDto convertToDto(Role entity) {
        return new RoleDto(entity);
    }

    /**
     * FIXED: Publish event SAU KHI transaction commit
     * Event listener sẽ xử lý cache invalidation
     */
    @Override
    @Transactional
    public RoleDto saveOrUpdate(RoleDto dto) {
        Role entity = null;
        if (dto.getId() != null) {
            entity = repository.findById(dto.getId()).orElse(null);
        }
        if (entity == null) {
            entity = new Role();
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        // Handle permissions
        rolePermissionService.handleSetPermissionForRole(dto, entity);

        // Save entity
        entity = repository.save(entity);

        // Lấy danh sách users bị ảnh hưởng TRƯỚC KHI publish event
        Set<String> affectedUserNames = getUserNamesByRole(entity.getId());

        log.debug("Role {} updated, affecting {} users", entity.getName(), affectedUserNames.size());

        // Publish event - listener sẽ xử lý SAU KHI transaction commit
        // Xem @TransactionalEventListener(phase = AFTER_COMMIT)
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, UPDATE_CHANGE_TYPE)
        );

        return convertToDto(entity);
    }

    /**
     * FIXED: Publish event SAU KHI delete thành công
     */
    @Override
    @Transactional
    public void deleteById(UUID id) {
        if (id == null) return;

        // Lấy affected users TRƯỚC KHI delete
        Set<String> affectedUserNames = getUserNamesByRole(id);

        // Delete
        super.deleteById(id);

        log.debug("Role {} deleted, affecting {} users", id, affectedUserNames.size());

        // Publish event sau delete
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, REMOVE_CHANGE_TYPE)
        );
    }

    /**
     * FIXED: Batch delete với event publishing
     */
    @Override
    @Transactional
    public int deleteMultiple(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        // Lấy affected users TRƯỚC KHI delete
        Set<String> affectedUserNames = getUserNamesByRoles(ids);

        // Delete
        int deleted = super.deleteMultiple(ids);

        log.debug("Deleted {} roles, affecting {} users", deleted, affectedUserNames.size());

        // Publish event
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, REMOVE_CHANGE_TYPE)
        );

        return deleted;
    }

    /**
     * Lấy usernames bị ảnh hưởng khi role thay đổi
     */
    private Set<String> getUserNamesByRole(UUID roleId) {
        if (roleId == null) return Set.of();
        return userRepository.findUserNamesByRoleId(roleId);
    }

    /**
     * Lấy usernames bị ảnh hưởng khi nhiều roles thay đổi
     */
    private Set<String> getUserNamesByRoles(List<UUID> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) return Set.of();
        return userRepository.findUserNamesByRoleIds(roleIds);
    }

    @Override
    public Page<RoleDto> pagingSearch(SearchDto dto) {
        int pageIndex = (dto.getPageIndex() == null || dto.getPageIndex() < 1) ? 0 : dto.getPageIndex() - 1;
        int pageSize = (dto.getPageSize() == null || dto.getPageSize() < 10) ? 10 : dto.getPageSize();

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(entity.id) FROM Role entity WHERE (1=1) ");
        StringBuilder sql = new StringBuilder("SELECT new com.buihien.core.dto.security.RoleDto(entity) FROM Role entity WHERE (1=1) ");

        sql.append(builderWhereClause(dto));
        sqlCount.append(builderWhereClause(dto));

        TypedQuery<RoleDto> q = manager.createQuery(sql.toString(), RoleDto.class);
        TypedQuery<Long> qCount = manager.createQuery(sqlCount.toString(), Long.class);

        setParameter(q, dto);
        setParameter(qCount, dto);

        q.setFirstResult(pageIndex * pageSize);
        q.setMaxResults(pageSize);

        return new PageImpl<>(q.getResultList(), PageRequest.of(pageIndex, pageSize), qCount.getSingleResult());
    }

    @Override
    public void setParameter(Query query, SearchDto dto) {
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
    public StringBuilder builderWhereClause(SearchDto dto) {
        StringBuilder whereClause = new StringBuilder();

        if (dto.getVoided() == null || !dto.getVoided()) {
            whereClause.append(" AND entity.voided = false ");
        } else {
            whereClause.append(" AND entity.voided = true ");
        }

        if (dto.getKeyword() != null && StringUtils.hasText(dto.getKeyword())) {
            whereClause.append(" AND (LOWER(entity.name) LIKE LOWER(:text) OR LOWER(entity.code) LIKE LOWER(:text) OR LOWER(entity.description) LIKE LOWER(:text)) ");
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