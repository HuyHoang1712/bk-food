package com.example.demo.user;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.order.Order;
import com.example.demo.restaurant.Restaurant;

import jakarta.persistence.*;
// import jakarta.validation.constraints.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 50)
    private String name;

    
    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(length = 10, unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(length=20, nullable = false)
    private RoleType role;

    private String address;

    @OneToOne(mappedBy = "owner")
    private Restaurant restaurant;

    @OneToOne(mappedBy = "user")
    private DeliveryProfile deliveryProfile;

    @OneToMany(mappedBy="user")
    private List<Order> orders = new ArrayList<>();

    public User(Integer id, String name, String email, String password, String phone, RoleType role, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.address = address;
        
    }

    public User() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public DeliveryProfile getDeliveryProfile() {
        return deliveryProfile;
    }

    public void setDeliveryProfile(DeliveryProfile deliveryProfile) {
        this.deliveryProfile = deliveryProfile;
    }
    
}
