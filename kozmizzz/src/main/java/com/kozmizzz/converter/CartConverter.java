package com.kozmizzz.converter;

import com.kozmizzz.dto.CartDTO;
import com.kozmizzz.dto.CartItemDTO;
import com.kozmizzz.dto.CategoryDTO;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.CartItem;

import java.util.List;

public class CartConverter {
    public static CartDTO convertToCartDto(List<CartItem> cartItems) {
        List<CartItemDTO> itemDtos = cartItems.stream()
                .map(item -> new CartItemDTO(
                        new ProductDTO(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getDescription(),
                                item.getProduct().getPrice(),
                                item.getProduct().getStockQuantity(),
                                new CategoryDTO(
                                        item.getProduct().getCategory().getId(),
                                        item.getProduct().getCategory().getName()
                                ),
                                item.getProduct().getImageUrls(),
                                item.getProduct().getRating()
                        ),
                        item.getQuantity()
                ))
                .toList();

        double total = itemDtos.stream()
                .mapToDouble(item -> (item.getProduct().getPrice() * item.getQuantity()))
                .sum();

        return new CartDTO(itemDtos, total);
    }

}
