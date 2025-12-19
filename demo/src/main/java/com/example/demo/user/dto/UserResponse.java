package com.example.demo.user.dto;

import com.example.demo.user.RoleType;
import com.example.demo.user.User;

public class UserResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private RoleType role;
    private Integer restaurantId;
    private String vehicleType;
    public UserResponse() {
    }

    public UserResponse (User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.role = user.getRole();
        this.restaurantId = (role == RoleType.restaurant ? user.getRestaurant().getId() : null);
        this.vehicleType = (role == RoleType.delivery ? user.getDeliveryProfile().getVehicleType() : null);
    }

    // public UserResponse(Integer id, String name, String email, String phone, String address, RoleType role) {
    //     this.id = id;
    //     this.name = name;
    //     this.email = email;
    //     this.phone = phone;
    //     this.address = address;
    //     this.role = role;
    // }
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
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public RoleType getRole() {
        return role;
    }
    public void RoleType(RoleType role) {
        this.role = role;
    }
    public Integer getRestaurantId() {
        return restaurantId;
    }
    public void setRestaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
    }
    public String getVehicleType() {
        return vehicleType;
    }
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
    
}
