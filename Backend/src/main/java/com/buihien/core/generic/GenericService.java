package com.buihien.core.generic;

import com.buihien.core.dto.AuditableDto;
import com.buihien.core.dto.search.SearchDto;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface GenericService<DTO extends AuditableDto, S extends SearchDto> {
    void deleteById(UUID id);

    int deleteMultiple(List<UUID> ids);

    DTO saveOrUpdate(DTO dto);

    Page<DTO> pagingSearch(S search);

    DTO getById(UUID id);

    void setParameter(Query query, S dto);

    StringBuilder builderWhereClause(S dto);
}
