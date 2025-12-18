package com.example.demo.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Integer id,
        Integer restaurantId,
        Integer customerId,
        Long total,
        String status,
        String deliveryAddress,
        String customerPhone,
        LocalDateTime createdAt,
        List<Item> items, 
        String note,
        Integer deliveryAssignmentId
) {
    public record Item(
            Integer menuItemId,
            String menuItemName,
            Integer quantity, Integer price
    ) {}
}
