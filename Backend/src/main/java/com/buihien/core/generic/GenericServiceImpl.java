package com.buihien.core.generic;

import com.buihien.core.domain.Auditable;
import com.buihien.core.dto.AuditableDto;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.exception.NotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Transactional
public abstract class GenericServiceImpl<E extends Auditable, DTO extends AuditableDto, S extends SearchDto> implements GenericService<DTO, S> {
    private static final Logger logger = LoggerFactory.getLogger(GenericServiceImpl.class);
    @Autowired
    protected JpaRepository<E, UUID> repository;

    @PersistenceContext
    protected EntityManager manager;

    protected abstract DTO convertToDto(E entity);

    public abstract DTO saveOrUpdate(DTO dto);

    public abstract void setParameter(Query query, S dto);

    public abstract StringBuilder builderWhereClause(S dto);

    @Override
    public DTO getById(UUID id) {
        logger.info("Đang tìm kiếm thực thể với ID: {}", id);
        Optional<E> entity = repository.findById(id);
        if (entity.isPresent()) {
            logger.info("Lấy thực thể thành công.");
            return this.convertToDto(entity.get());
        } else {
            logger.warn("Không tìm thấy thực thể với ID: {}", id);
            throw new NotFoundException("Không tìm thấy dữ liệu với ID: " + id);
        }
    }

    @Override
    public void deleteById(UUID id) {
        logger.info("Đang xóa thực thể với ID: {}", id);
        if (repository.existsById(id)) {
            repository.deleteById(id);
            logger.info("Đã xóa thực thể thành công với ID: {}", id);
        } else {
            logger.warn("Không tìm thấy thực thể để xóa với ID: {}", id);
            throw new NotFoundException("Không tìm thấy dữ liệu để xóa với ID: " + id);
        }
    }

    @Override
    public int deleteMultiple(List<UUID> ids) {
        logger.info("Đang xóa nhiều thực thể với các ID: {}", ids);
        if (ids == null || ids.isEmpty()) {
            logger.warn("Danh sách ID rỗng. Không có thực thể nào để xóa.");
            throw new NotFoundException("Danh sách ID rỗng. Không có thực thể nào để xóa.");
        }
        repository.deleteAllById(ids);
        logger.info("Đã xóa thành công {} thực thể.", ids.size());
        return ids.size();
    }
}
