package com.example.demo.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.order.Order;

public interface OrderRepository extends JpaRepository<Order, Integer>{
     List<Order> findByUser_EmailOrderByCreatedAtDesc(String email);
     List<Order> findByRestaurant_IdOrderByCreatedAtDesc(Integer restaurantId);
}
