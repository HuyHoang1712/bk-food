package com.example.demo.user.dto;

public record MeResponse(
    Integer id,
    String name,
    String email,
    String role,
    Integer restaurantId
) {}
