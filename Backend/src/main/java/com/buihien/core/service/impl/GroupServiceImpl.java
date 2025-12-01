package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Group;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.dto.security.GroupDto;
import com.buihien.core.event.PermissionChangedEvent;
import com.buihien.core.generic.GenericServiceImpl;
import com.buihien.core.repository.UserRepository;
import com.buihien.core.service.GroupRoleService;
import com.buihien.core.service.GroupService;
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
public class GroupServiceImpl extends GenericServiceImpl<Group, GroupDto, SearchDto> implements GroupService {

    private static final Logger log = LoggerFactory.getLogger(GroupServiceImpl.class);

    @Autowired
    private GroupRoleService groupRoleService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected GroupDto convertToDto(Group entity) {
        return new GroupDto(entity, true);
    }

    @Override
    @Transactional
    public GroupDto saveOrUpdate(GroupDto dto) {
        Group entity = null;
        if (dto.getId() != null) {
            entity = repository.findById(dto.getId()).orElse(null);
        }
        if (entity == null) {
            entity = new Group();
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        // Handle roles for group
        groupRoleService.handleSetRoleForGroup(dto, entity);

        // Save
        entity = repository.save(entity);

        // Lấy danh sách users bị ảnh hưởng
        Set<String> affectedUserNames = getUserNamesByGroup(entity.getId());

        log.debug("Group {} updated, affecting {} users", entity.getName(), affectedUserNames.size());

        // Publish event - listener sẽ xử lý SAU transaction commit
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, UPDATE_CHANGE_TYPE)
        );

        return convertToDto(entity);
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        if (id == null) return;

        // Lấy affected users TRƯỚC KHI delete
        Set<String> affectedUserNames = getUserNamesByGroup(id);

        // Delete
        super.deleteById(id);

        log.debug("Group {} deleted, affecting {} users", id, affectedUserNames.size());

        // Publish event
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, REMOVE_CHANGE_TYPE)
        );
    }

    @Override
    @Transactional
    public int deleteMultiple(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        // Lấy affected users TRƯỚC delete
        Set<String> affectedUserNames = getUserNamesByGroups(ids);

        // Delete
        int deleted = super.deleteMultiple(ids);

        log.debug("Deleted {} groups, affecting {} users", deleted, affectedUserNames.size());

        // Publish event
        eventPublisher.publishEvent(
                new PermissionChangedEvent(affectedUserNames, REMOVE_CHANGE_TYPE)
        );

        return deleted;
    }

    private Set<String> getUserNamesByGroup(UUID groupId) {
        if (groupId == null) return Set.of();
        return userRepository.findUserNamesByGroupId(groupId);
    }

    private Set<String> getUserNamesByGroups(List<UUID> groupIds) {
        if (groupIds == null || groupIds.isEmpty()) return Set.of();
        return userRepository.findUserNamesByGroupIds(groupIds);
    }

    @Override
    public Page<GroupDto> pagingSearch(SearchDto dto) {
        int pageIndex = (dto.getPageIndex() == null || dto.getPageIndex() < 1) ? 0 : dto.getPageIndex() - 1;
        int pageSize = (dto.getPageSize() == null || dto.getPageSize() < 10) ? 10 : dto.getPageSize();

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(entity.id) FROM Group entity WHERE (1=1) ");
        StringBuilder sql = new StringBuilder("SELECT new com.buihien.core.dto.security.GroupDto(entity, true) FROM Group entity WHERE (1=1) ");

        sql.append(builderWhereClause(dto));
        sqlCount.append(builderWhereClause(dto));

        TypedQuery<GroupDto> q = manager.createQuery(sql.toString(), GroupDto.class);
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
            whereClause.append(" AND (LOWER(entity.name) LIKE LOWER(:text) OR LOWER(entity.description) LIKE LOWER(:text)) ");
        }

        if (dto.getFromDate() != null) {
            whereClause.append(" AND entity.createDate >= :fromDate ");
        }
        if (dto.getToDate() != null) {
            whereClause.append(" AND entity.createDate <= :toDate ");
        }
        whereClause.append(dto.getOrderBy() != null && dto.getOrderBy() ? " ORDER BY entity.createdAt ASC" : " ORDER BY entity.createdAt DESC ");

        return whereClause;
    }
}