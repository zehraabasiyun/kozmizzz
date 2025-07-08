package com.kozmizzz.controller;

import com.kozmizzz.dto.CategoryDTO;
import com.kozmizzz.dto.ProductDTO;
import com.kozmizzz.entity.Product;
import com.kozmizzz.repository.ProductRepository;
import com.kozmizzz.repository.ProductReviewRepository;
import com.kozmizzz.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO productDto = productService.getProductById(id);
        return ResponseEntity.ok(productDto);
    }


}
