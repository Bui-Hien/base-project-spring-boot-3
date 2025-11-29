package com.buihien.core.service.impl;

import com.buihien.core.domain.FileDescription;
import com.buihien.core.dto.FileDescriptionDto;
import com.buihien.core.exception.NotFoundException;
import com.buihien.core.service.FileDescriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileDescriptionServiceImpl implements FileDescriptionService {
    private static final Logger logger = LoggerFactory.getLogger(FileDescriptionServiceImpl.class);

    @Value("${save-file-folder}")
    private String pathFileFolder;
    @Value("${save-file-folder-public}")
    private String pathFileFolderPublic;

    @Autowired
    protected JpaRepository<FileDescription, UUID> repository;

    @Override
    public void deleteById(UUID id) {
        FileDescription entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy file với ID: " + id));

        // Xóa file vật lý
        if (entity.getFilePath() != null) {
            File file = new File(pathFileFolder, entity.getFilePath());
            if (file.exists()) {
                if (file.delete()) {
                    logger.info("Đã xóa file vật lý: {}", file.getAbsolutePath());
                } else {
                    logger.warn("Không thể xóa file vật lý: {}", file.getAbsolutePath());
                }
            }
        }

        repository.deleteById(id);
        logger.info("Đã xóa FileDescription với ID: {}", id);
    }

    @Override
    public FileDescriptionDto saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new NotFoundException("File tải lên rỗng!");
        }

        String originalFileName = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFileName)) {
            throw new RuntimeException("Tên file không hợp lệ!");
        }

        String extension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFileName.substring(dotIndex + 1);
        }

        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + (extension.isEmpty() ? "" : "." + extension);

        File uploadDir = new File(pathFileFolder);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new RuntimeException("Không thể tạo thư mục upload: " + uploadDir.getAbsolutePath());
        }

        File dest = new File(uploadDir, fileName);
        try {
            file.transferTo(dest);
            logger.info("Đã lưu file vật lý tại: {}", dest.getAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file vào ổ đĩa!", e);
        }

        FileDescription entity = new FileDescription();
        entity.setName(originalFileName);
        entity.setFilePath(fileName);
        entity.setExtension(extension);
        entity.setContentSize(file.getSize());
        entity.setContentType(file.getContentType());

        entity = repository.save(entity);
        logger.info("Đã lưu FileDescription với ID: {}", entity.getId());

        return new FileDescriptionDto(entity);
    }


    @Override
    public FileDescriptionDto getById(UUID id) {
        logger.info("Đang tìm FileDescription với ID: {}", id);
        return repository.findById(id)
                .map(entity -> {
                    logger.info("Đã tìm thấy FileDescription với ID: {}", id);
                    return new FileDescriptionDto(entity);
                })
                .orElseThrow(() -> new NotFoundException("Không tìm thấy FileDescription với ID: " + id));
    }

    @Override
    public FileDescriptionDto saveFilePublic(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new NotFoundException("File tải lên rỗng!");
        }

        String originalFileName = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFileName)) {
            throw new RuntimeException("Tên file không hợp lệ!");
        }

        String extension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFileName.substring(dotIndex + 1);
        }

        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + (extension.isEmpty() ? "" : "." + extension);

        File uploadDir = new File(pathFileFolderPublic);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new RuntimeException("Không thể tạo thư mục upload: " + uploadDir.getAbsolutePath());
        }

        File dest = new File(uploadDir, fileName);
        try {
            file.transferTo(dest);
            logger.info("Đã lưu file vật lý tại: {}", dest.getAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file vào ổ đĩa!", e);
        }

        FileDescription entity = new FileDescription();
        entity.setName(originalFileName);
        entity.setFilePath(fileName);
        entity.setExtension(extension);
        entity.setContentSize(file.getSize());
        entity.setContentType(file.getContentType());

        entity = repository.save(entity);
        logger.info("Đã lưu FileDescription với ID: {}", entity.getId());

        return new FileDescriptionDto(entity);
    }
}
