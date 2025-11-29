package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Permission;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.dto.security.PermissionDto;
import com.buihien.core.generic.GenericServiceImpl;
import com.buihien.core.service.PermissionService;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PermissionServiceImpl extends GenericServiceImpl<Permission, PermissionDto, SearchDto> implements PermissionService {
    private static final Logger log = LoggerFactory.getLogger(PermissionServiceImpl.class);

    @Override
    protected PermissionDto convertToDto(Permission entity) {
        return new PermissionDto(entity);
    }

    @Override
    public PermissionDto saveOrUpdate(PermissionDto dto) {
        return null;
    }

    @Override
    public Page<PermissionDto> pagingSearch(SearchDto dto) {
        int pageIndex = (dto.getPageIndex() == null || dto.getPageIndex() < 1) ? 0 : dto.getPageIndex() - 1;
        int pageSize = (dto.getPageSize() == null || dto.getPageSize() < 10) ? 10 : dto.getPageSize();

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(entity.id) FROM Permission entity WHERE (1=1) ");
        StringBuilder sql = new StringBuilder("SELECT new com.buihien.core.dto.security.PermissionDto(entity) FROM Permission entity WHERE (1=1) ");

        sql.append(builderWhereClause(dto));
        sqlCount.append(builderWhereClause(dto));

        TypedQuery<PermissionDto> q = manager.createQuery(sql.toString(), PermissionDto.class);
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
        whereClause.append(dto.getOrderBy() != null && dto.getOrderBy() ? " ORDER BY entity.createdAt ASC" : " ORDER BY entity.createdAt DESC");

        return whereClause;
    }
}