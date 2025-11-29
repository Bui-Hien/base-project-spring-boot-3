package com.buihien.core.controller;

import com.buihien.core.dto.FileDescriptionDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.FileDescriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.UUID;

@RequestMapping("/api/file-description")
@RestController
@Validated
public class RestFileController {
    private static final Logger log = LoggerFactory.getLogger(RestFileController.class);
    @Value("${save-file-folder}")
    private String pathFileFolder;
    @Value("${save-file-folder-public}")
    private String pathFileFolderPublic;
    @Autowired
    private FileDescriptionService fileDescriptionService;

    @PostMapping(value = "/save-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).FILE_WRITE)")
    public ResponseData<FileDescriptionDto> saveFile(@RequestParam("file") MultipartFile file) {
        FileDescriptionDto result = fileDescriptionService.saveFile(file);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully saved", result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).FILE_DELETE)")
    public ResponseData<?> deleteById(@PathVariable UUID id) {
        fileDescriptionService.deleteById(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Delete success by id " + id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).FILE_VIEW)")
    public ResponseEntity<Resource> getFileById(@PathVariable("id") UUID id) throws IOException {
        FileDescriptionDto result = fileDescriptionService.getById(id);

        // Ghép đường dẫn đầy đủ: thư mục lưu + tên file trong DB
        File file = new File(pathFileFolder, result.getFilePath());
        if (!file.exists()) {
            throw new FileNotFoundException("Không tìm thấy file: " + file.getAbsolutePath());
        }

        // Dùng contentType từ DB nếu có
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (result.getContentType() != null) {
            try {
                mediaType = MediaType.parseMediaType(result.getContentType());
            } catch (Exception ignored) {
            }
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + result.getName() + "\"")
                .contentLength(file.length())
                .body(resource);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Resource> getPublicFileById(@PathVariable("id") UUID id) throws IOException {
        FileDescriptionDto result = fileDescriptionService.getById(id);

        // Ghép đường dẫn đầy đủ: thư mục lưu + tên file trong DB
        File file = new File(pathFileFolderPublic, result.getFilePath());
        if (!file.exists()) {
            throw new FileNotFoundException("Không tìm thấy file: " + file.getAbsolutePath());
        }

        // Dùng contentType từ DB nếu có
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (result.getContentType() != null) {
            try {
                mediaType = MediaType.parseMediaType(result.getContentType());
            } catch (Exception ignored) {
            }
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + result.getName() + "\"")
                .contentLength(file.length())
                .body(resource);
    }

    @PostMapping(value = "/public/save-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<FileDescriptionDto> saveFilePublic(@RequestParam("file") MultipartFile file) {
        FileDescriptionDto result = fileDescriptionService.saveFilePublic(file);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully saved", result);
    }
}
