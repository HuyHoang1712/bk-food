package com.example.demo.menuitem;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer>{
    @EntityGraph(attributePaths = {"category", "restaurant"})
    List<MenuItem> findByRestaurant_Id (Integer id);

    @EntityGraph(attributePaths = {"category", "restaurant"})
    List<MenuItem> findAll();
}
