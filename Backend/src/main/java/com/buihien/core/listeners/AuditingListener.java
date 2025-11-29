package com.buihien.core.listeners;

import com.buihien.core.domain.Auditable;
import com.buihien.core.domain.security.User;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

public class AuditingListener {
    
    private String resolveUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User result) {
            return result.getUsername();
        }
        return "system"; // fallback nếu chạy async/job
    }

    @PostRemove
    public void postRemove(Auditable entity) {
        LocalDateTime now = LocalDateTime.now();
        entity.setUpdatedAt(now);
        entity.setUpdatedBy(resolveUsername());
        entity.setTraceLog(getStackTrace()); // log full stack khi remove
    }

    @PrePersist
    public void beforePersist(Auditable entity) {
        LocalDateTime now = LocalDateTime.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);

        String username = resolveUsername();
        entity.setCreatedBy(username);
        entity.setUpdatedBy(username);

        entity.setTraceLog(getStackTrace()); // log full stack khi insert
    }

    @PreUpdate
    public void beforeMerge(Auditable entity) {
        LocalDateTime now = LocalDateTime.now();
        entity.setUpdatedAt(now);
        entity.setUpdatedBy(resolveUsername());
        entity.setTraceLog(getStackTrace()); // log full stack khi update
    }

    private String getStackTrace() {
        boolean filter = StringUtils.hasText("com.buihien.core");
        StringBuilder traceInfo = new StringBuilder();
        StackTraceElement[] traces = Thread.currentThread().getStackTrace();

        for (int i = traces.length - 1; i >= 0; i--) {
            String traceStr = traces[i].toString();

            if (traceStr.contains("AuditingListener") || traceStr.contains("PreFilter.doFilterInternal")) {
                continue;
            }

            if (!filter || traceStr.contains("com.buihien.core")) {
                if (!traceInfo.isEmpty()) {
                    traceInfo.append(" >> ");
                }
                traceInfo.append(traceStr);
            }
        }
        return traceInfo.toString();
    }

}
