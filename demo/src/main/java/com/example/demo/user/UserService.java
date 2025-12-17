package com.example.demo.user;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.restaurant.Restaurant;
import com.example.demo.restaurant.repo.RestaurantRepository;
import com.example.demo.user.dto.UserRequest;
import com.example.demo.user.dto.UserResponse;
import com.example.demo.user.repository.DeliveryProfileRepository;
import com.example.demo.user.repository.UserRepository;


@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final RestaurantRepository restaurantRepo;
    private final DeliveryProfileRepository deliveryRepo;
    public UserService (UserRepository repo, 
        PasswordEncoder encoder,
        RestaurantRepository restaurantRepo,
        DeliveryProfileRepository deliveryRepo){
        this.repo = repo;
        this.encoder = encoder;
        this.restaurantRepo = restaurantRepo;
        this.deliveryRepo = deliveryRepo;
    }

    public User toEntity(UserRequest request) {
        return new User(null, request.getName(), request.getEmail(), encoder.encode(request.getPassword()),
        request.getPhone(), request.getRole(), request.getAddress());
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return repo.findAll().stream()
            .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById (Integer id) {
        User user = repo.findById(id).
            orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest req) {
         if (req.getRole() == RoleType.restaurant && req.restaurantId == null)
            throw new IllegalArgumentException("restaurantId is required for RESTAURANT role");

        if (req.getRole() == RoleType.delivery && (req.vehicleType == null || req.vehicleType.isBlank()))
            throw new IllegalArgumentException("vehicleType is required for DELIVERY role");
        //save the user
        User saved = repo.save(toEntity(req));

        if (req.getRole() == RoleType.restaurant) {
            Restaurant restaurant = restaurantRepo.findById(req.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Cannot find the restaurant with id: " + req.getRestaurantId()));
            if (restaurant.getOwner() != null) {
                throw new IllegalStateException("Restaurant already has an owner");
            }
            saved.setRestaurant(restaurant);
            restaurant.setOwner(saved);
            restaurantRepo.save(restaurant);
        }
        else if (req.getRole() == RoleType.delivery) {
            DeliveryProfile d = new DeliveryProfile();
            saved.setDeliveryProfile(d);
            d.setUser(saved);
            d.setVehicleType(req.getVehicleType());
            deliveryRepo.save(d);
        }

        return toResponse(saved);
    }

    // @Transactional
    // public UserResponse updateUser(UserRequest request, Integer id) {
    //     User user = repo.findById(id).
    //         orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    //     user.setName(request.getName());
    //     user.setEmail(request.getEmail());
    //     user.setPassword(request.getPassword()); // password hash
    //     user.setPhone(request.getPhone());
    //     user.setRole(request.getRole());
    //     user.setAddress(request.getAddress());
    //     // User saved = repo.save(user);
    //     // Dirty checking test
    //     return toResponse(user);
    // }

    @Transactional
    public void deleteUser(Integer id) {
        User user = repo.findById(id).
            orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        repo.delete(user);
    }
}
