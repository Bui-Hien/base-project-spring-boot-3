package com.buihien.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;

/**
 * Entity đại diện cho metadata của một file được lưu trong hệ thống.
 *
 * Lưu ý: dùng soft delete với Hibernate (@SQLDelete)
 *
 * Thường được dùng để liên kết với các entity khác như UserDto, Order, hoặc Account
 * để quản lý file đính kèm (attachments).
 *
 * @author buixuanhienmy@gmail.com
 */
@Entity
@Table(name = "tbl_file_description")
@SQLDelete(sql = "UPDATE tbl_file_description SET voided = true WHERE id = ?")
public class FileDescription extends Auditable {

    @Column(name = "content_type")
    private String contentType; // MIME type

    @Column(name = "content_size")
    private Long contentSize;   // dung lượng file (bytes)

    @Column(name = "name")
    private String name;        // tên file gốc

    @Column(name = "extension")
    private String extension;   // phần mở rộng

    @Column(name = "file_path")
    private String filePath;    // đường dẫn file trong storage

    @Column(name = "is_pending")
    private Boolean isPending;

    public FileDescription() {
        super();
    }

    // Getters & Setters
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getContentSize() { return contentSize; }
    public void setContentSize(Long contentSize) { this.contentSize = contentSize; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExtension() { return extension; }
    public void setExtension(String extension) { this.extension = extension; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Boolean getIsPending() {
        return isPending;
    }

    public void setIsPending(Boolean pending) {
        isPending = pending;
    }
}
