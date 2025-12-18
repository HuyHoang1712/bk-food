package com.example.demo.restaurant.dto;

import java.math.BigDecimal;
import java.util.List;

public record RestaurantResponse(
        Integer id,
        String name,
        String description,
        String image,
        BigDecimal rating,
        String deliveryTime,
        Integer deliveryFee,
        Integer minOrder,
        Boolean isOpen,
        List<String> categories
) {}
