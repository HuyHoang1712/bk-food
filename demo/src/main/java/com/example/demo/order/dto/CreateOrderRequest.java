package com.example.demo.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateOrderRequest(
        @NotNull Integer restaurantId,
        @NotNull List<Item> items,
        String deliveryAddress,
        String customerPhone,
        String note
) {
    public record Item(
            @NotNull Integer menuItemId,
            @NotNull @Min(1) Integer quantity
    ) {}
}

