package com.kozmizzz.service;


import com.kozmizzz.converter.ProductConverter;
import com.kozmizzz.dto.CategoryDTO;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.Product;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository, ProductReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(product -> {
                    Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());

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
                            avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0
                    );
                })
                .toList();
    }


    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        Double avgRating = reviewRepository.findAverageRatingByProductId(id);

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
                avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0
        );
    }

}
