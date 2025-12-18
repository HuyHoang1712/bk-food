package com.example.demo.menuitem;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuItemService {
    private final MenuItemRepository repo;
    public MenuItemService (MenuItemRepository repo) {
        this.repo = repo;
    }

    public MenuItemResponse toResponse(MenuItem item) {
        return new MenuItemResponse(item.getId(), item.getName(), item.getDescription(), item.getPrice(),
        item.getImage(), item.getCategory().getName(), item.getRestaurant().getId(), item.getAvailable());
    }

    @Transactional(readOnly = true)
    public List <MenuItemResponse> getAllItems () {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getItemsByRestaurantId (Integer id){
        return repo.findByRestaurant_Id(id).stream().map(this::toResponse).toList();
    }
}
