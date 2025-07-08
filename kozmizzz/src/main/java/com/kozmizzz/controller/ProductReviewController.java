package com.kozmizzz.controller;

import com.kozmizzz.dto.ProductReviewDTO;
import com.kozmizzz.entity.ProductReview;
import com.kozmizzz.service.ProductReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ProductReviewController {

    private final ProductReviewService reviewService;

    public ProductReviewController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ProductReview> addReview(@PathVariable Long productId,
                                                   @RequestBody ProductReview reviewRequest) {
        ProductReview savedReview = reviewService.addReview(productId, reviewRequest);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping
    public ResponseEntity<List<ProductReviewDTO>> getReviews(@PathVariable Long productId) {
        List<ProductReviewDTO> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

}

