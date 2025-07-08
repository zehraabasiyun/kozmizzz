package com.kozmizzz.service;

import com.kozmizzz.converter.ProductConverter;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.Favorite;
import com.kozmizzz.entity.Product;
import com.kozmizzz.entity.User;
import com.kozmizzz.repository.FavoriteRepository;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.utils.UserSessionUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserSessionUtil userSessionUtil;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           ProductRepository productRepository,
                           UserSessionUtil userSessionUtil) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userSessionUtil = userSessionUtil;
    }

    public void addToFavorites(Long productId) {
        User user = userSessionUtil.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        if (favoriteRepository.findByUserAndProduct(user, product).isEmpty()) {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setProduct(product);
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void removeFromFavorites(Long productId) {
        User user = userSessionUtil.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        favoriteRepository.deleteByUserAndProduct(user, product);
    }

    public List<ProductDTO> getFavorites() {
        User user = userSessionUtil.getCurrentUser();
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        return ProductConverter.convertFavoritesToDtoList(favorites);
    }
}

