package com.kozmizzz.dto;

import java.time.LocalDateTime;

public class ProductReviewDTO {
    private Long id;
    private String comment;
    private Double rating;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;

    public ProductReviewDTO(Long id, String comment, Double rating, LocalDateTime createdAt, Long userId, String username) {
        this.id = id;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = createdAt;
        this.userId = userId;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
