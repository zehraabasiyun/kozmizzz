package com.kozmizzz.controller;

import com.kozmizzz.dto.OrderDTO;
import com.kozmizzz.entity.Order;
import com.kozmizzz.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/complete/{shippingCompanyId}")
    public void checkout(@PathVariable String shippingCompanyId) {
        orderService.completeOrder(shippingCompanyId);
    }

    @GetMapping()
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        return ResponseEntity.ok(orderService.getOrdersForCurrentUser());
    }
}
