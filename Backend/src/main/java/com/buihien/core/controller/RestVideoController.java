package com.buihien.core.controller;

import com.buihien.core.domain.FileDescription;
import com.buihien.core.service.FileDescriptionVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/video")
public class RestVideoController {

    @Autowired
    private FileDescriptionVideoService videoService;

    @Value("${save-file-folder}")
    private String baseFolder;

    private Path getHlsBase() {
        return Paths.get(baseFolder, "video", "hls");
    }

    /* ----------------------------------------------------
     * 1) INITIALIZE UPLOAD
     * ---------------------------------------------------- */
    @PostMapping("/init")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).VIDEO_WRITE)")
    public ResponseEntity<String> initUpload() throws Exception {
        String uploadId = videoService.initUpload();
        return ResponseEntity.ok(uploadId);
    }

    /* ----------------------------------------------------
     * 2) UPLOAD CHUNK
     * ---------------------------------------------------- */
    @PostMapping("/upload")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).VIDEO_WRITE)")
    public ResponseEntity<String> uploadChunk(
            @RequestParam String uploadId,
            @RequestParam int index,
            @RequestParam MultipartFile chunk
    ) throws Exception {

        videoService.uploadChunk(uploadId, index, chunk);
        return ResponseEntity.ok("chunk " + index + " uploaded");
    }

    /* ----------------------------------------------------
     * 3) COMPLETE UPLOAD
     * ---------------------------------------------------- */
    @PostMapping("/complete")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).VIDEO_WRITE)")
    public ResponseEntity<FileDescription> completeUpload(
            @RequestParam String uploadId,
            @RequestParam String fileName
    ) throws Exception {

        FileDescription saved = videoService.completeUpload(uploadId, fileName);
        return ResponseEntity.ok(saved);
    }

    /* ----------------------------------------------------
     * 4) STREAM HLS MANIFEST
     * ---------------------------------------------------- */
    @GetMapping("/hls/{id}/manifest.m3u8")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).VIDEO_VIEW)")
    public ResponseEntity<Resource> getManifest(@PathVariable UUID id) throws Exception {
        Path manifest = getHlsBase().resolve(id.toString()).resolve("manifest.m3u8");
        if (!Files.exists(manifest)) return ResponseEntity.notFound().build();

        Resource res = new UrlResource(manifest.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/x-mpegURL"))
                .body(res);
    }

    /* ----------------------------------------------------
     * 5) STREAM HLS SEGMENT
     * ---------------------------------------------------- */
    @GetMapping("/hls/{id}/{segment}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).VIDEO_VIEW)")
    public ResponseEntity<Resource> getSegment(
            @PathVariable UUID id,
            @PathVariable String segment
    ) throws Exception {

        Path segmentFile = getHlsBase().resolve(id.toString()).resolve(segment);
        if (!Files.exists(segmentFile)) return ResponseEntity.notFound().build();

        Resource res = new UrlResource(segmentFile.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("video/mp2t"))
                .body(res);
    }
}
