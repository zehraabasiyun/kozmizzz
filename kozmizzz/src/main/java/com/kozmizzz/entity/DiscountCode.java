package com.kozmizzz.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "discount_codes")
public class DiscountCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private double discountPercentage = 0.0; // Örn: 50.0 = %50

    private boolean active = true;

    private boolean oneTimeUse = false;

    @ManyToMany
    private List<User> usedByUsers = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isOneTimeUse() {
        return oneTimeUse;
    }

    public void setOneTimeUse(boolean oneTimeUse) {
        this.oneTimeUse = oneTimeUse;
    }

    public List<User> getUsedByUsers() {
        return usedByUsers;
    }

    public void setUsedByUsers(List<User> usedByUsers) {
        this.usedByUsers = usedByUsers;
    }
}

