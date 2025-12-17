package com.example.demo.user.dto;

import org.hibernate.validator.constraints.Length;

import com.example.demo.user.RoleType;

import jakarta.validation.constraints.*;

public class UserRequest {
    @Size(max = 50)
    @NotBlank(message = "Name is required!")
    private String name;

    @NotBlank(message = "Email is required!")
    @Email(message = "Email is invalid!")
    @Size(max = 50)
    private String email;

    @NotBlank(message = "Password is required!")
    @Size(max = 100)
    private String password;

    @Size(min = 10, max = 10, message = "Phone must be 10 digits")
    @Pattern(regexp = "\\d{10}", message = "Phone must contain only digits")
    private String phone;

    @NotBlank(message = "Role is required!")
    private RoleType role;
    private String address;

    public Integer restaurantId;   // required if role == RESTAURANT (if assigning existing restaurant)
    public String vehicleType;  // required if role == DELIVERY

    public UserRequest() {}

    public UserRequest(String name, String email, String password, String phone, RoleType role, String address, Integer restaurantId, String vehicleType) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.address = address;
        this.restaurantId = restaurantId;
        this.vehicleType = vehicleType;
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
