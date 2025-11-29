package com.buihien.core.service.impl;

import com.buihien.core.domain.FileDescription;
import com.buihien.core.repository.FileDescriptionRepository;
import com.buihien.core.service.FileDescriptionVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.Comparator;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class FileDescriptionVideoServiceImpl implements FileDescriptionVideoService {

    @Autowired
    private FileDescriptionRepository repo;
    @Value("${save-file-folder}")
    private String baseFolder;
    @Value("${ffmpeg.path}")
    private String ffmpegPath;

    private final ExecutorService ffmpegExecutor = Executors.newFixedThreadPool(2);

    private Path getRawBase() {
        return Paths.get(baseFolder, "video", "raw");
    }

    private Path getHlsBase() {
        return Paths.get(baseFolder, "video", "hls");
    }

    @Override
    public String initUpload() throws IOException {
        String uploadId = UUID.randomUUID().toString();
        Files.createDirectories(getRawBase().resolve(uploadId));
        return uploadId;
    }

    @Override
    public void uploadChunk(String uploadId, int index, MultipartFile chunk) throws IOException {
        Path dir = getRawBase().resolve(uploadId);
        if (!Files.exists(dir)) Files.createDirectories(dir);

        Path part = dir.resolve(String.format("%05d.part", index));

        try (InputStream in = chunk.getInputStream()) {
            Files.copy(in, part, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    @Override
    @Transactional
    public FileDescription completeUpload(String uploadId, String originalFileName) throws Exception {
        Path dir = getRawBase().resolve(uploadId);
        if (!Files.exists(dir)) throw new FileNotFoundException("Upload id not found: " + uploadId);

        // Nơi lưu file mp4 đã assemble
        Path assembled = getRawBase().resolve(uploadId + ".mp4");

        // Merge file parts
        try (OutputStream out = Files.newOutputStream(assembled, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            Files.list(dir)
                    .sorted()
                    .forEach(p -> {
                        try (InputStream is = Files.newInputStream(p)) {
                            is.transferTo(out);
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
                    });
        }

        // Save to DB
        FileDescription fd = new FileDescription();
        fd.setName(originalFileName);
        fd.setContentSize(Files.size(assembled));
        fd.setContentType("video/mp4");
        fd.setExtension("mp4");

        // relative path FE sẽ dùng
        String relativePath = "video/raw/" + uploadId + ".mp4";
        fd.setFilePath(relativePath);

        // **Set pending = true vì HLS đang convert**
        fd.setIsPending(true);

        FileDescription saved = repo.save(fd);

        // Create HLS dir theo videoId
        String videoId = saved.getId().toString();
        Path hlsDir = getHlsBase().resolve(videoId);
        Files.createDirectories(hlsDir);

        // FFmpeg convert HLS async
        ffmpegExecutor.submit(() -> {
            try {
                runFFmpegToHls(assembled, hlsDir);

                // Sau khi convert xong, set pending = false
                saved.setIsPending(false);
                repo.save(saved);
                try {
                    Files.deleteIfExists(assembled);
                    System.out.println("[CLEANUP] Deleted raw video: " + assembled);
                } catch (Exception e) {
                    System.err.println("[CLEANUP ERROR] Cannot delete raw mp4: " + assembled);
                    e.printStackTrace();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Cleanup parts folder
        try {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException ignored) {
        }

        return saved;
    }

    private void runFFmpegToHls(Path inputMp4, Path hlsDir) throws IOException, InterruptedException {
        String manifest = hlsDir.resolve("manifest.m3u8").toString();
        String segmentPattern = hlsDir.resolve("segment_%03d.ts").toString();

        ProcessBuilder pb = new ProcessBuilder(
                ffmpegPath, // dùng path đầy đủ tới ffmpeg.exe
                "-y",
                "-i", inputMp4.toString(),
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
                "-c:a", "aac", "-b:a", "128k",
                "-hls_time", "6",
                "-hls_playlist_type", "vod",
                "-hls_segment_filename", segmentPattern,
                manifest
        );

        pb.redirectErrorStream(true);

        Process p = pb.start();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        }

        int code = p.waitFor();
        if (code != 0) throw new RuntimeException("FFmpeg exited with code " + code);
    }

    @Override
    public FileDescription findById(UUID id) {
        return repo.findById(id).orElse(null);
    }
}
