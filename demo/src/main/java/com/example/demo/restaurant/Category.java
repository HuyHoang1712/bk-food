package com.example.demo.restaurant;


import java.util.HashSet;
import java.util.Set;

import com.example.demo.menuitem.MenuItem;

import jakarta.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "category")
    Set<MenuItem> menuItems = new HashSet<>();

    @ManyToMany(mappedBy = "categories")
    private Set<Restaurant> restaurants = new HashSet<>();

    public Category() {}
    public Category(Integer id, String name) {
        this.id = id;
        this.name = name;
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
    public Set<Restaurant> getRestaurants() {
        return restaurants;
    }
    public void setRestaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }

    
}
