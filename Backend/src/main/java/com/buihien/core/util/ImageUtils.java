package com.buihien.core.util;

import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Iterator;

public class ImageUtils {

    // ================= ENUM ==================
    public enum ImageFormat {
        JPG("jpg"),
        JPEG("jpeg"),
        PNG("png"),
        GIF("gif"),
        BMP("bmp"),
        WBMP("wbmp"),
        TIFF("tiff"),
        WEBP("webp"); // cần plugin WebP

        private final String value;

        ImageFormat(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum ImageQuality {
        LOW(0.5f),
        MEDIUM(0.7f),
        HIGH(0.85f),
        MAX(1.0f);

        private final float value;

        ImageQuality(float value) {
            this.value = value;
        }

        public float getValue() {
            return value;
        }
    }

    public enum ImageSize {
        AVATAR(512, 512),
        BANK_PROOF(800, 1200),
        THUMBNAIL(256, 256),
        CUSTOM(0, 0);

        private final int width;
        private final int height;

        ImageSize(int width, int height) {
            this.width = width;
            this.height = height;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }
    }

    // ================= CORE ==================
    public static void processImage(File inputFile,
                                    double scale,
                                    float quality,
                                    ImageSize size,
                                    ImageFormat format,
                                    int customW,
                                    int customH,
                                    File outputFile) throws IOException {

        if (format == null) {
            format = ImageFormat.JPG; // fallback (JPG support tốt nhất)
        }

        BufferedImage original = ImageIO.read(inputFile);
        if (original == null) {
            throw new IOException("Không đọc được ảnh từ file: " + inputFile.getName());
        }

        int targetW, targetH;
        if (size == ImageSize.CUSTOM && customW > 0 && customH > 0) {
            targetW = customW;
            targetH = customH;
        } else if (size != ImageSize.CUSTOM) {
            targetW = size.getWidth();
            targetH = size.getHeight();
        } else {
            targetW = (int) (original.getWidth() * scale);
            targetH = (int) (original.getHeight() * scale);
        }

        // Resize ảnh bằng Graphics2D
        BufferedImage resized = new BufferedImage(targetW, targetH, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(original, 0, 0, targetW, targetH, null);
        g2d.dispose();

        // Ghi ảnh với compression
        try (FileOutputStream fos = new FileOutputStream(outputFile);
             ImageOutputStream ios = ImageIO.createImageOutputStream(fos)) {

            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName(format.getValue());
            if (!writers.hasNext()) {
                throw new IllegalArgumentException("Không tìm thấy writer cho format: " + format);
            }

            ImageWriter writer = writers.next();
            writer.setOutput(ios);

            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(quality);
            }

            writer.write(null, new IIOImage(resized, null, null), param);
            writer.dispose();
        }
    }

    public static void processImage(MultipartFile file,
                                    double scale,
                                    float quality,
                                    ImageSize size,
                                    ImageFormat format,
                                    int customW,
                                    int customH,
                                    File outputFile) throws IOException {
        File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
        file.transferTo(tempFile);
        processImage(tempFile, scale, quality, size, format, customW, customH, outputFile);
        tempFile.delete();
    }

    // ================== TIỆN ÍCH ==================
    public static File resizeAvatar(MultipartFile file) throws IOException {
        File outputFile = File.createTempFile("avatar-", ".jpg");
        processImage(file,
                1.0,
                ImageQuality.MEDIUM.getValue(),
                ImageSize.AVATAR,
                ImageFormat.JPG,
                0, 0,
                outputFile);
        return outputFile;
    }

    public static File resizeBankProof(MultipartFile file) throws IOException {
        File outputFile = File.createTempFile("bank-proof-", ".jpg");
        processImage(file,
                1.0,
                ImageQuality.HIGH.getValue(),
                ImageSize.BANK_PROOF,
                ImageFormat.JPG,
                0, 0,
                outputFile);
        return outputFile;
    }
}
