package com.buihien.core.generic;

import com.fasterxml.jackson.annotation.JsonInclude;

public class PageResponse<T> {
    private int pageNo;
    private int pageSize;
    private int totalPage;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T items;

    public PageResponse() {
    }

    public PageResponse(int pageNo, int pageSize, int totalPage,T items) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.totalPage = totalPage;
        this.items = items;
    }

    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public T getItems() {
        return items;
    }

    public void setItems(T items) {
        this.items = items;
    }
}