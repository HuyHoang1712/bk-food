package com.example.demo.menuitem;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MenuItemController {
    private final MenuItemService service;
    public MenuItemController (MenuItemService service) {
        this.service = service;
    }

    @GetMapping("/menu-items")
    public List<MenuItemResponse> getAllItems() {
        return service.getAllItems();
    }

    @GetMapping("/restaurants/{id}/menu-items")
    public List<MenuItemResponse> getItemsByRestaurantId (@PathVariable Integer id) {
        // check existence
        return service.getItemsByRestaurantId(id);
    }
}
