package com.example.demo.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.user.DeliveryProfile;

public interface DeliveryProfileRepository extends JpaRepository<DeliveryProfile, Integer> {
    
}
