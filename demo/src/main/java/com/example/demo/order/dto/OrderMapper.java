package com.example.demo.order.dto;

import java.util.Collections;
import java.util.List;

import com.example.demo.order.Order;
import com.example.demo.order.OrderDetails;

import java.util.Collections;
import java.util.List;

public class OrderMapper {

    private OrderMapper() {}

    public static OrderResponse toResponse(Order o) {
        if (o == null) return null;

        List<OrderResponse.Item> items =
                (o.getOrderdetails() == null)
                        ? Collections.emptyList()
                        : o.getOrderdetails().stream()
                              .map(OrderMapper::toItem)
                              .toList();

        return new OrderResponse(
                o.getId(),
                o.getRestaurant() != null ? o.getRestaurant().getId() : null,
                o.getUser() != null ? o.getUser().getId() : null,
                o.getTotal(),
                o.getStatus(),
                o.getDeliveryAddress(),
                o.getCustomerPhone(),
                o.getCreatedAt(),
                items,
                o.getNote() // <-- requires Order has `note` field + getter
        );
    }

    private static OrderResponse.Item toItem(OrderDetails od) {
        Integer menuItemId = (od.getMenuItem() != null) ? od.getMenuItem().getId() : null;
        return new OrderResponse.Item(menuItemId, od.getMenuItem().getName(), od.getQuantity(), od.getMenuItem().getPrice());
    }
}
