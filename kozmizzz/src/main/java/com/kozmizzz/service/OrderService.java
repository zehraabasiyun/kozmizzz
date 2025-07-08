package com.kozmizzz.service;


import com.kozmizzz.dto.CartItemDTO;
import com.kozmizzz.dto.OrderDTO;
import com.kozmizzz.dto.OrderItemDTO;
import com.kozmizzz.entity.*;
import com.kozmizzz.enums.OrderStatus;
import com.kozmizzz.repository.OrderRepository;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.repository.ShippingCompanyRepository;
import com.kozmizzz.utils.UserSessionUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserSessionUtil userSessionUtil;
    private final ShippingCompanyRepository shippingCompanyRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, CartService cartService, UserSessionUtil userSessionUtil, ShippingCompanyRepository shippingCompanyRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.userSessionUtil = userSessionUtil;
        this.shippingCompanyRepository = shippingCompanyRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void completeOrder(String shippingCompanyId) {
        User user = userSessionUtil.getCurrentUser();
        List<CartItem> cartItems = cartService.getCartItems();

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Sepet boş!");
        }

        ShippingCompany company = shippingCompanyRepository.findById(shippingCompanyId)
                .orElseThrow(() -> new RuntimeException("Kargo firması bulunamadı"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.ORDERED);

        List<OrderItem> orderItems = cartItems.stream().map(item -> {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(item.getProduct());
            oi.setQuantity(item.getQuantity());
            return oi;
        }).toList();

        order.setItems(orderItems);

        Shipping shipping = new Shipping();
        shipping.setOrder(order);
        shipping.setCompany(company);
        shipping.setUpdatedAt(LocalDateTime.now());

        order.setShipping(shipping);

        orderRepository.save(order);
        cartService.clearCart();
    }

    public List<OrderDTO> getOrdersForCurrentUser() {
        User user = userSessionUtil.getCurrentUser();

        List<Order> orders = orderRepository.findByUserId(user.getId());

        return orders.stream().map(order -> {
            List<OrderItemDTO> itemDtos = order.getItems().stream().map(item -> new OrderItemDTO(
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getProduct().getPrice(),
                    item.getQuantity() * item.getProduct().getPrice()
            )).toList();

            return new OrderDTO(
                    order.getId(),
                    order.getCreatedAt(),
                    order.getStatus(),
                    itemDtos,
                    order.getShipping().getCompany().getName()
            );
        }).toList();
    }

}
