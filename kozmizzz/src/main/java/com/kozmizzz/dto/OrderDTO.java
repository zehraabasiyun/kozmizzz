package com.kozmizzz.dto;

import com.kozmizzz.dto.OrderItemDTO;
import com.kozmizzz.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private List<OrderItemDTO> items;
    private String shippingCompany;

    public OrderDTO(Long id, LocalDateTime createdAt, OrderStatus status, List<OrderItemDTO> items, String shippingCompany) {
        this.id = id;
        this.createdAt = createdAt;
        this.status = status;
        this.items = items;
        this.shippingCompany = shippingCompany;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getShippingCompany() {
        return shippingCompany;
    }

    public void setShippingCompany(String shippingCompany) {
        this.shippingCompany = shippingCompany;
    }
}
