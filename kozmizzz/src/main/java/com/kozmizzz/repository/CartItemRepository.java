package com.kozmizzz.repository;

import com.kozmizzz.entity.Cart;
import com.kozmizzz.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductId(Cart cart, Long productId);

}
