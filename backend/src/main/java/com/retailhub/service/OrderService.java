package com.retailhub.service;

import com.retailhub.model.Order;
import com.retailhub.model.User;
import com.retailhub.repository.OrderRepository;
import com.retailhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, CartService cartService, UserRepository userRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order checkout(String userId) {
        List<Map<String, Object>> cartItems = cartService.getCartWithProductDetails(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order.OrderItem> orderItems = cartItems.stream().map(item -> {
            Order.OrderItem oi = new Order.OrderItem();
            oi.setProductId((String) item.get("productId"));
            oi.setName((String) item.get("name"));
            oi.setImage((String) item.get("image"));
            oi.setPrice(Double.valueOf(item.get("price").toString()));
            oi.setQuantity((Integer) item.get("quantity"));
            return oi;
        }).collect(Collectors.toList());

        double total = orderItems.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        double tax = Math.round(total * 0.18 * 100.0) / 100.0;
        double shipping = total > 999.0 ? 0.0 : 99.0;
        double grandTotal = total + tax + shipping;

        Order order = new Order(
                userId,
                user.getName(),
                user.getEmail(),
                orderItems,
                grandTotal,
                "Pending",
                LocalDateTime.now()
        );

        orderRepository.save(order);
        cartService.clearCart(userId);

        // Send order confirmation email asynchronously or sync
        emailService.sendOrderConfirmationEmail(user.getEmail(), order.getId(), grandTotal);

        return order;
    }

    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
