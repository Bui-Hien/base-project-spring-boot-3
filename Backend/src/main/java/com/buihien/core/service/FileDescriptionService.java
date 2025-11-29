package com.buihien.core.service;

import com.buihien.core.dto.FileDescriptionDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileDescriptionService {
    void deleteById(UUID id);

    FileDescriptionDto saveFile(MultipartFile file);

    FileDescriptionDto getById(UUID id);

    FileDescriptionDto saveFilePublic(MultipartFile file);
}
