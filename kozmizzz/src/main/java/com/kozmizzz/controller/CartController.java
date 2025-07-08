package com.kozmizzz.controller;

import com.kozmizzz.converter.CartConverter;
import com.kozmizzz.dto.CartDTO;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.Product;
import com.kozmizzz.entity.CartItem;
import com.kozmizzz.service.CartService;
import com.kozmizzz.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;

    public CartController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToCart(@PathVariable Long productId,
                                            @RequestParam(defaultValue = "1") int quantity) {
        ProductDTO product = productService.getAllProducts()
                .stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cartService.addToCart(product.getId(), quantity);
        return ResponseEntity.ok("Product added to cart!");
    }


    @GetMapping
    public ResponseEntity<CartDTO> getCartItems() {
        List<CartItem> cartItems = cartService.getCartItems();
        CartDTO cartDto = CartConverter.convertToCartDto(cartItems);
        return ResponseEntity.ok(cartDto);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeOne(@PathVariable Long productId) {
        cartService.removeOneFromCart(productId);
        return ResponseEntity.ok("Ürün sepetten silindi.");
    }

    @PostMapping("/apply-discount")
    public ResponseEntity<Double> applyDiscount(@RequestParam String code) {
        double discountedTotal = cartService.applyDiscountCode(code);
        return ResponseEntity.ok(discountedTotal);
    }

}

