package com.kozmizzz.converter;

import com.kozmizzz.dto.CategoryDTO;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.Favorite;
import com.kozmizzz.entity.Product;

import java.util.List;
import java.util.stream.Collectors;

public class ProductConverter {

    public static List<ProductDTO> convertToDtoList(List<Product> products) {
        return products.stream()
                .map(ProductConverter::convertToDto)
                .collect(Collectors.toList());
    }

    public static ProductDTO convertToDto(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                new CategoryDTO(
                        product.getCategory().getId(),
                        product.getCategory().getName()
                ),
                product.getImageUrls(),
                product.getRating()
        );
    }

    public static List<ProductDTO> convertFavoritesToDtoList(List<Favorite> favorites) {
        return favorites.stream()
                .map(fav -> convertToDto(fav.getProduct()))
                .collect(Collectors.toList());
    }
}
