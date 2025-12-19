package com.example.demo.order;


import java.util.ArrayList;
import java.util.List;

import com.example.demo.restaurant.Restaurant;
import com.example.demo.user.User;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import jakarta.persistence.*;

@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="restaurant_id")
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(mappedBy="order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetails> orderdetails = new ArrayList<>();

    @Column(nullable = false)
    private Long total = 0L;

    private String status;

    private String deliveryAddress;
    private String customerPhone;
    private String note;

    @Column(nullable = false, columnDefinition = "DATETIME(0)")
    private LocalDateTime createdAt;  

    public Order() {}

    public Order(Integer id, String status, String deliveryAddress, String customerPhone, String note) {
        this.id = id;
        this.status = status;
        this.deliveryAddress = deliveryAddress;
        this.customerPhone = customerPhone;
        this.note = note;
    }

    public void calcTotal() {
        this.total = orderdetails.stream()
            .mapToLong(od -> (long) od.getUnitPrice() * od.getQuantity())
            .sum();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderDetails> getOrderdetails() {
        return orderdetails;
    }
    
    
}
