package com.kozmizzz.service;

import com.kozmizzz.dto.CartItemDTO;
import com.kozmizzz.entity.*;
import com.kozmizzz.repository.CartItemRepository;
import com.kozmizzz.repository.CartRepository;
import com.kozmizzz.repository.DiscountCodeRepository;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.utils.UserSessionUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserSessionUtil userSessionUtil;
    private final CartItemRepository cartItemRepository;
    private final DiscountCodeRepository discountCodeRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserSessionUtil userSessionUtil, CartItemRepository cartItemRepository, DiscountCodeRepository discountCodeRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userSessionUtil = userSessionUtil;
        this.cartItemRepository = cartItemRepository;
        this.discountCodeRepository = discountCodeRepository;
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public void addToCart(Long productId, int quantity) {
        User user = userSessionUtil.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = getOrCreateCart(user);

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
    }


    public List<CartItem> getCartItems() {
        User user = userSessionUtil.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        double discountRate = cart.getDiscountRate() != null ? cart.getDiscountRate() : 0.0;

        return cart.getItems().stream().map(item -> {
            Product original = item.getProduct();

            if (discountRate > 0) {
                Product discounted = new Product();
                discounted.setId(original.getId());
                discounted.setName(original.getName());
                discounted.setDescription(original.getDescription());
                discounted.setPrice((double) Math.round(original.getPrice() * (1 - discountRate / 100.0)));
                discounted.setImageUrls(original.getImageUrls());
                discounted.setStockQuantity(original.getStockQuantity());
                discounted.setCategory(original.getCategory());
                item.setProduct(discounted);
            }

            return item;
        }).toList();
    }



    @Transactional
    public void removeOneFromCart(Long productId) {
        User user = userSessionUtil.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Kullanıcının sepeti bulunamadı"));

        CartItem item = cartItemRepository.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new RuntimeException("Ürün sepette bulunamadı"));

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            cartItemRepository.save(item);
        } else {
            cartItemRepository.delete(item);
        }
    }


    public void clearCart() {
        User user = userSessionUtil.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public double calculateTotal() {
        User user = userSessionUtil.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public double applyDiscountCode(String code) {
        User user = userSessionUtil.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Sepet bulunamadı"));

        DiscountCode discount = discountCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Kod geçersiz"));

        if (!discount.isActive()) throw new RuntimeException("Kod devre dışı");

        if (discount.isOneTimeUse() && discount.getUsedByUsers().contains(user)) {
            throw new RuntimeException("Bu kodu daha önce kullandınız");
        }

        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice())
                .sum();

        double discountedTotal = Math.round(
                total * (1 - discount.getDiscountPercentage() / 100.0) * 100.0
        ) / 100.0;

        if (discount.isOneTimeUse()) {
            discount.getUsedByUsers().add(user);
            discountCodeRepository.save(discount);
        }
        cart.setDiscountRate(discount.getDiscountPercentage());
        cartRepository.save(cart);

        return discountedTotal;
    }

}
