package com.example.demo.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.order.OrderDetails;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Integer>{

}
