package com.retailhub.controller;

import com.retailhub.model.Order;
import com.retailhub.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order, Authentication auth) {
        order.setUserId(auth.getName());
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(Authentication auth) {
        return ResponseEntity.ok(orderService.checkout(auth.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }
}
