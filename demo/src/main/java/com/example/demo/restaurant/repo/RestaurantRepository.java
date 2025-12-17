package com.example.demo.restaurant.repo;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.restaurant.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer>{
    @EntityGraph(attributePaths = "categories")
    List<Restaurant> findAll();
}
