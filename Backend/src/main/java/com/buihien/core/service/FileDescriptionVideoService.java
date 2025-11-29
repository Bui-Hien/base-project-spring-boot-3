package com.buihien.core.service;


import com.buihien.core.domain.FileDescription;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface FileDescriptionVideoService {
    String initUpload() throws IOException;
    void uploadChunk(String uploadId, int index, MultipartFile chunk) throws IOException;
    FileDescription completeUpload(String uploadId, String originalFileName) throws Exception;
    FileDescription findById(UUID id);
}
