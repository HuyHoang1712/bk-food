package com.example.demo.order;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.menuitem.MenuItem;
import com.example.demo.menuitem.MenuItemRepository;
import com.example.demo.order.dto.CreateOrderRequest;
import com.example.demo.order.dto.OrderMapper;
import com.example.demo.order.dto.OrderResponse;
import com.example.demo.order.repository.OrderRepository;
import com.example.demo.restaurant.Restaurant;
import com.example.demo.restaurant.repo.RestaurantRepository;
import com.example.demo.user.RoleType;
import com.example.demo.user.User;
import com.example.demo.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public Order placeOrder(String email, CreateOrderRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order items cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Restaurant restaurant = restaurantRepository.findById(req.restaurantId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus("pending"); 
        order.setDeliveryAddress(req.deliveryAddress());
        order.setCustomerPhone(req.customerPhone());
        order.setCreatedAt(LocalDateTime.now());
        order.setNote(req.note());

        // build order details from request
        for (CreateOrderRequest.Item itemReq : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "MenuItem not found: " + itemReq.menuItemId()));

            // ensure menuItem belongs to restaurant
            if (menuItem.getRestaurant() != null && menuItem.getRestaurant().getId() != null) {
                if (!menuItem.getRestaurant().getId().equals(req.restaurantId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "MenuItem " + itemReq.menuItemId() + " does not belong to restaurant " + req.restaurantId());
                }
            }

            Integer unitPrice = menuItem.getPrice(); 
            if (unitPrice == null || unitPrice < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid price for menuItem: " + itemReq.menuItemId());
            }

            OrderDetails od = new OrderDetails();
            od.setOrder(order);
            od.setMenuItem(menuItem);
            od.setQuantity(itemReq.quantity());
            od.setUnitPrice(unitPrice);

            order.getOrderdetails().add(od); // cascade persists details
        }

        order.calcTotal(); // sum(unitPrice * qty)
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Transactional(readOnly = true)
    public List<Order>getAllOrders() {
        return orderRepository.findAll();
    }


    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(String email) {
        return orderRepository.findByUser_EmailOrderByCreatedAtDesc(email);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByRestaurant(Integer restaurantId) {
        return orderRepository.findByRestaurant_IdOrderByCreatedAtDesc(restaurantId);
    }

    @Transactional
    public OrderResponse updateStatus(Integer orderId, String username, String newStatus) {
        // 1) Load caller + order
        User caller = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // 2) Authorization: only restaurant owner of THIS restaurant can update status
        // (You can extend later: customer can cancel, delivery can set delivering/completed, etc.)
        boolean isRestaurantOwner = caller.getRole() == RoleType.restaurant; // adjust role enum
        if (!isRestaurantOwner) {
            throw new RuntimeException("Forbidden: only restaurant owner can update order status.");
        }

        Integer ownerId = order.getRestaurant().getOwner().getId(); // adjust mapping
        if (!caller.getId().equals(ownerId)) {
            throw new RuntimeException("Forbidden: you do not own this restaurant.");
        }

        order.setStatus(newStatus);

        // save is optional inside @Transactional if the entity is managed,
        // but it’s ok to be explicit:
        Order saved = orderRepository.save(order);

        // 5) Return DTO
        return OrderMapper.toResponse(saved);
    }
}
