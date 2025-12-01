package com.buihien.core.util;

import com.buihien.core.domain.SystemConfig;
import com.buihien.core.dto.SystemConfigDto;
import com.buihien.core.generic.GenericCache;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;

public class CacheUtils {
    public static final GenericCache<String, SystemConfigDto> HashSystemConfig = new GenericCache<>(1000 * 60 * 60 * 24);
    public static final GenericCache<String, Set<String>> HashCachePermission = new GenericCache<>(1000 * 60 * 60 * 24);

    public static void loadHashSystemConfig(List<SystemConfig> list) {
        if (!CollectionUtils.isEmpty(list)) {
            for (SystemConfig item : list) {
                HashSystemConfig.put(item.getKey(), new SystemConfigDto(item));
            }
        }
    }
}
