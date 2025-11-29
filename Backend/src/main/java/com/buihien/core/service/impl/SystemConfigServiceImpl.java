package com.buihien.core.service.impl;

import com.buihien.core.domain.SystemConfig;
import com.buihien.core.dto.SystemConfigDto;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.generic.GenericServiceImpl;
import com.buihien.core.repository.SystemConfigRepository;
import com.buihien.core.service.SystemConfigService;
import com.buihien.core.util.CacheUtils;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class SystemConfigServiceImpl extends GenericServiceImpl<SystemConfig, SystemConfigDto, SearchDto> implements SystemConfigService {
    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Override
    protected SystemConfigDto convertToDto(SystemConfig entity) {
        return new SystemConfigDto(entity);
    }

    @Override
    public SystemConfigDto saveOrUpdate(SystemConfigDto dto) {
        SystemConfig entity = null;
        if (dto.getId() != null) {
            entity = repository.findById(dto.getId()).orElse(null);
        }
        if (entity == null) {
            entity = new SystemConfig();
        }
        entity.setVoided(false);
        entity.setValue(dto.getValue().strip());
        entity.setDescription(dto.getDescription());

        entity = repository.save(entity);

        SystemConfig finalEntity = entity;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                CacheUtils.HashSystemConfig.put(finalEntity.getKey(), new SystemConfigDto(finalEntity));
            }
        });
        return this.convertToDto(entity);
    }

    @Override
    public Page<SystemConfigDto> pagingSearch(SearchDto dto) {
        int pageIndex = (dto.getPageIndex() == null || dto.getPageIndex() < 1) ? 0 : dto.getPageIndex() - 1;
        int pageSize = (dto.getPageSize() == null || dto.getPageSize() < 10) ? 10 : dto.getPageSize();

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(entity.id) FROM SystemConfig entity ");
        StringBuilder sql = new StringBuilder("SELECT new com.buihien.core.dto.SystemConfigDto(entity) FROM SystemConfig entity ");

        sql.append(this.builderWhereClause(dto));
        sqlCount.append(this.builderWhereClause(dto));

        TypedQuery<SystemConfigDto> q = manager.createQuery(sql.toString(), SystemConfigDto.class);
        TypedQuery<Long> qCount = manager.createQuery(sqlCount.toString(), Long.class);

        this.setParameter(q, dto);
        this.setParameter(qCount, dto);

        q.setFirstResult(pageIndex * pageSize);
        q.setMaxResults(pageSize);

        return new PageImpl<>(q.getResultList(), PageRequest.of(pageIndex, pageSize), (long) qCount.getSingleResult());
    }

    @Override
    public List<SystemConfigDto> getAllSystemConfig() {
        return systemConfigRepository.getAllSystemConfig();
    }

    @Override
    public void setParameter(Query q, SearchDto dto) {
        if (q == null) return;

        if (dto.getKeyword() != null && StringUtils.hasText(dto.getKeyword())) {
            q.setParameter("text", '%' + dto.getKeyword() + '%');
        }

        if (dto.getFromDate() != null) {
            q.setParameter("fromDate", dto.getFromDate());
        }
        if (dto.getToDate() != null) {
            q.setParameter("toDate", dto.getToDate());
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
