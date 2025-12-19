package com.example.demo.review;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

// @Entity
// @Table(name = "reviews")
// @Getter @Setter
// @NoArgsConstructor @AllArgsConstructor
// @Builder
// public class Review {

//     @Id
//     @Column(length = 50)
//     private Integer id;          // "r1"

//     @Column(nullable = false, length = 50)
//     private Integer orderId;     // "o1"

//     @Column(nullable = false, length = 50)
//     private Integer customerId;  // "u1"

//     @Column(nullable = false)
//     private Integer restaurantId; // 1

//     @Column(nullable = false)
//     private Integer rating;     // 1..5

//     @Column(length = 1000)
//     private String comment;

//     @CreationTimestamp
//     @Column(nullable = false, updatable = false)
//     private Instant createdAt;
// }
