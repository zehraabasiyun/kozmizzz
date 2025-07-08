package com.kozmizzz.repository;

import com.kozmizzz.entity.Cart;
import com.kozmizzz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
