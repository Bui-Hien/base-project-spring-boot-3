package com.buihien.core.service;

import com.buihien.core.dto.SystemConfigDto;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.generic.GenericService;

import java.util.List;

public interface SystemConfigService extends GenericService<SystemConfigDto, SearchDto> {
    List<SystemConfigDto> getAllSystemConfig();
}
