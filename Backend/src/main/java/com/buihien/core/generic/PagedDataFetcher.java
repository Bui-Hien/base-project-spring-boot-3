package com.buihien.core.generic;

import java.util.List;

@FunctionalInterface
public interface PagedDataFetcher<DTO> {
    List<DTO> getPage(int pageIndex, int pageSize);
}