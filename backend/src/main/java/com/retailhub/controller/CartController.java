package com.retailhub.controller;

import com.retailhub.dto.CartItemRequest;
import com.retailhub.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCartWithProductDetails(auth.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<List<Map<String, Object>>> addToCart(@RequestBody CartItemRequest request, Authentication auth) {
        cartService.addToCart(auth.getName(), request.productId(), request.quantity());
        return ResponseEntity.ok(cartService.getCartWithProductDetails(auth.getName()));
    }

    @PutMapping("/update")
    public ResponseEntity<List<Map<String, Object>>> updateQuantity(@RequestBody CartItemRequest request, Authentication auth) {
        cartService.updateQuantity(auth.getName(), request.productId(), request.quantity());
        return ResponseEntity.ok(cartService.getCartWithProductDetails(auth.getName()));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<List<Map<String, Object>>> removeFromCart(@PathVariable String productId, Authentication auth) {
        cartService.removeFromCart(auth.getName(), productId);
        return ResponseEntity.ok(cartService.getCartWithProductDetails(auth.getName()));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.ok().build();
    }
}
