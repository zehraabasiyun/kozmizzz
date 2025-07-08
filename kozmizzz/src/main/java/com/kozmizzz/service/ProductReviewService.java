package com.kozmizzz.service;

import com.kozmizzz.converter.ReviewConverter;
import com.kozmizzz.dto.ProductReviewDTO;
import com.kozmizzz.entity.Product;
import com.kozmizzz.entity.ProductReview;
import com.kozmizzz.entity.User;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.repository.ProductReviewRepository;
import com.kozmizzz.utils.UserSessionUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserSessionUtil userSessionUtil;

    public ProductReviewService(ProductReviewRepository reviewRepository,
                                ProductRepository productRepository,
                                UserSessionUtil userSessionUtil) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userSessionUtil = userSessionUtil;
    }

    public ProductReview addReview(Long productId, ProductReview reviewRequest) {
        User user = userSessionUtil.getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductReview review = new ProductReview();
        review.setComment(reviewRequest.getComment());
        review.setRating(reviewRequest.getRating());
        review.setProduct(product);
        review.setUser(user);

        return reviewRepository.save(review);
    }

    public List<ProductReviewDTO> getReviewsByProduct(Long productId) {
        return ReviewConverter.convertToDtoList(reviewRepository.findByProductId(productId));
    }
}

