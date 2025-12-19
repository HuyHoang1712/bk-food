package com.example.demo.menuitem.dto;

public class MenuItemRequest {
    private Integer id;
    private String name;
    private String description;

    private Integer price;

    private String image;

    private Integer categoryId;

    private Boolean available;

    public MenuItemRequest(Integer id, String name, String description, Integer price, String image, Integer categoryId,
            Boolean available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.available = available;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Integer getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public Boolean getAvailable() {
        return available;
    }
    
    
}
