package com.kozmizzz.repository;

import com.kozmizzz.entity.ShippingCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShippingCompanyRepository extends JpaRepository<ShippingCompany, String> {
    Optional<ShippingCompany> findByName(String name);
}
