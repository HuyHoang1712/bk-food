package com.example.demo.menuitem;

public record MenuItemResponse(Integer id, String name, String description, Integer price, 
    String image, String category, Integer restaurantId, Boolean available) 
{}
