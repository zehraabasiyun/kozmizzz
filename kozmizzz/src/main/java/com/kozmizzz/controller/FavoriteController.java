package com.kozmizzz.controller;

import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToFavorites(@PathVariable Long productId) {
        favoriteService.addToFavorites(productId);
        return ResponseEntity.ok("Favorilere eklendi");
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromFavorites(@PathVariable Long productId) {
        favoriteService.removeFromFavorites(productId);
        return ResponseEntity.ok("Favorilerden çıkarıldı");
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getFavorites() {
        return ResponseEntity.ok(favoriteService.getFavorites());
    }
}

