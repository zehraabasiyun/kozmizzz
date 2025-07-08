package com.kozmizzz.controller;

import com.kozmizzz.entity.DiscountCode;
import com.kozmizzz.repository.DiscountCodeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/discount-codes")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class DiscountCodeController {

    private final DiscountCodeRepository discountCodeRepository;

    public DiscountCodeController(DiscountCodeRepository discountCodeRepository) {
        this.discountCodeRepository = discountCodeRepository;
    }

    @PostMapping
    public ResponseEntity<String> createCode(@RequestBody DiscountCode code) {
        if (discountCodeRepository.findByCode(code.getCode()).isPresent()) {
            return ResponseEntity.badRequest().body("Bu kod zaten mevcut.");
        }

        discountCodeRepository.save(code);
        return ResponseEntity.ok("İndirim kodu başarıyla eklendi.");
    }

    @GetMapping
    public ResponseEntity<List<DiscountCode>> getAllCodes() {
        return ResponseEntity.ok(discountCodeRepository.findAll());
    }
}

