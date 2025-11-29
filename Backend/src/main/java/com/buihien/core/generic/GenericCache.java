package com.buihien.core.generic;

import org.openjdk.jol.info.GraphLayout;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class GenericCache<K, V> {

    private final Map<K, EntityCache> cacheMap = new ConcurrentHashMap<>();
    private final long ttlSeconds;

    public GenericCache(long ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
    }

    private class EntityCache {
        private final V value;
        private final LocalDateTime expiry;

        public EntityCache(V value, LocalDateTime expiry) {
            this.value = value;
            this.expiry = expiry;
        }

        public V getValue() {
            return value;
        }

        public LocalDateTime getExpiry() {
            return expiry;
        }
    }

    // GET with expiry check
    public V get(K key) {
        EntityCache entity = cacheMap.get(key);
        if (entity == null) return null;

        // Auto remove if expired
        if (LocalDateTime.now().isAfter(entity.getExpiry())) {
            cacheMap.remove(key);
            return null;
        }
        return entity.getValue();
    }

    // PUT (store with TTL)
    public void put(K key, V value) {
        cacheMap.put(key,
                new EntityCache(value, LocalDateTime.now().plusSeconds(ttlSeconds)));
    }

    // Remove all
    public void clear() {
        cacheMap.clear();
    }

    // Remove 1 key
    public void remove(K key) {
        cacheMap.remove(key);
    }

    // Remove many keys
    public void removes(List<K> keys) {
        if (keys != null && !keys.isEmpty()) {
            keys.forEach(cacheMap::remove);
        }
    }

    // Contains key?
    public boolean contains(K key) {
        return cacheMap.containsKey(key);
    }

    // Return raw map (not recommended for external use)
    public Map<K, V> getAll() {
        return cacheMap.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getValue()));
    }

    public Integer size() {
        return cacheMap.size();
    }

    // Memory usage
    public Double getMemoryUsage() {
        try {
            GraphLayout layout = GraphLayout.parseInstance(cacheMap);
            long totalBytes = layout.totalSize();
            return Double.valueOf(String.format("%.4f", totalBytes / (1024.0 * 1024.0)));
        } catch (Exception e) {
            return 0.0;
        }
    }
}
