package com.example.demo.restaurant;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.dto.RestaurantResponse;
// import com.example.demo.restaurant.repo.CategoryRepository;
import com.example.demo.restaurant.repo.RestaurantRepository;
// import com.example.demo.restaurant.Category;



@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepo;

    public RestaurantController(RestaurantRepository restaurantRepo) {
        this.restaurantRepo = restaurantRepo;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {

        List<RestaurantResponse> result = restaurantRepo.findAll()
                .stream()
                .map(r -> new RestaurantResponse(
                        r.getId(),
                        r.getName(),
                        r.getDescription(),
                        r.getImage(),
                        r.getRating(),
                        r.getDeliveryTime(),
                        r.getDeliveryFee(),
                        r.getMinOrder(),
                        r.getIsOpen(),
                        r.getCategories().stream().map(Category::getName).toList()
                ))
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById (@PathVariable Integer id) {
        Restaurant r = restaurantRepo.findById(id).
            orElseThrow(() -> new RuntimeException("Cannot find the given restaurant by id."));
        return ResponseEntity.ok(new RestaurantResponse(
            r.getId(),
            r.getName(),
            r.getDescription(),
            r.getImage(),
            r.getRating(),
            r.getDeliveryTime(),
            r.getDeliveryFee(),
            r.getMinOrder(),
            r.getIsOpen(),
            r.getCategories().stream().map(Category::getName).toList()
        ));
    }
}
