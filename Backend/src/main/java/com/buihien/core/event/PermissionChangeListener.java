package com.buihien.core.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import static com.buihien.core.util.CacheUtils.HashCachePermission;

@Component
public class PermissionChangeListener {

    private static final Logger log = LoggerFactory.getLogger(PermissionChangeListener.class);

    /**
     * Xử lý event SAU KHI transaction COMMIT
     * Đảm bảo cache chỉ bị xóa khi thay đổi DB thành công
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void handlePermissionChanged(PermissionChangedEvent event) {
        try {
            if (event.getAffectedUserNames() == null || event.getAffectedUserNames().isEmpty()) {
                log.warn("Permission change event với empty usernames, type: {}", event.getChangeType());
                return;
            }

            log.info("Invalidating cache for {} users due to permission change (type: {})",
                    event.getAffectedUserNames().size(),
                    event.getChangeType());

            // Xóa cache của các users bị ảnh hưởng
            HashCachePermission.removes(event.getAffectedUserNames().stream().toList());

            log.debug("Successfully invalidated cache for users: {}", event.getAffectedUserNames());

        } catch (Exception e) {
            log.error("Error handling permission change event", e);
            // Không throw exception để không ảnh hưởng transaction
        }
    }

    /**
     * Fallback handler nếu transaction bị rollback
     * Log để debug
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handlePermissionChangeRollback(PermissionChangedEvent event) {
        log.warn("Permission change transaction rolled back for {} users, type: {}",
                event.getAffectedUserNames().size(),
                event.getChangeType());
        // Không xóa cache vì transaction thất bại
    }

    /**
     * Handler cho completion (success hoặc failure)
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION)
    public void handlePermissionChangeCompletion(PermissionChangedEvent event) {
        log.debug("Permission change event completed for type: {}", event.getChangeType());
    }
}