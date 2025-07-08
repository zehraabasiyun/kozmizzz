package com.kozmizzz.converter;

import com.kozmizzz.dto.ProductReviewDTO;
import com.kozmizzz.entity.ProductReview;

import java.util.List;

public class ReviewConverter {

    public static ProductReviewDTO convertToDto(ProductReview review) {
        return new ProductReviewDTO(
                review.getId(),
                review.getComment(),
                review.getRating(),
                review.getCreatedAt(),
                review.getUser().getId(),
                review.getUser().getUsername()
        );
    }

    public static List<ProductReviewDTO> convertToDtoList(List<ProductReview> reviews) {
        return reviews.stream()
                .map(ReviewConverter::convertToDto)
                .toList();
    }
}
