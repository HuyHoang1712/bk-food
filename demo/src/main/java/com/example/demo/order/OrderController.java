package com.example.demo.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.demo.order.dto.CreateOrderRequest;
import com.example.demo.order.dto.OrderMapper;
import com.example.demo.order.dto.OrderResponse;
import com.example.demo.security.UserDetailsImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestBody @Valid CreateOrderRequest request
    ) {
        Order saved = orderService.placeOrder(principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toResponse(saved));
    }

    // GET /api/orders/me
    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> myOrders(
            @AuthenticationPrincipal UserDetailsImpl principal
    ) {
        List<OrderResponse> res = orderService.getOrdersByUser(principal.getUsername())
                .stream()
                .map(OrderMapper::toResponse)
                .toList();

        return ResponseEntity.ok(res);
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(OrderMapper.toResponse(order));
    }

    @GetMapping
public ResponseEntity<List<OrderResponse>> getAllOrders() {
    List<Order> orders = orderService.getAllOrders();
    List<OrderResponse> responses = orders.stream()
            .map(OrderMapper::toResponse)
            .toList(); 
    return ResponseEntity.ok(responses);
}

    // GET /api/orders/restaurant/{restaurantId}
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByRestaurant(@PathVariable Integer restaurantId) {
        List<OrderResponse> res = orderService.getOrdersByRestaurant(restaurantId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();

        return ResponseEntity.ok(res);
    }

     public record UpdateOrderStatusRequest(
            String status
    ) {}

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse updated = orderService.updateStatus(
                id,
                principal.getUsername(),
                request.status()
        );
        return ResponseEntity.ok(updated);
    }
}

