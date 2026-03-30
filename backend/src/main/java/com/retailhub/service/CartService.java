package com.retailhub.service;

import com.retailhub.model.Cart;
import com.retailhub.repository.CartRepository;
import com.retailhub.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(userId)));
    }

    public List<Map<String, Object>> getCartWithProductDetails(String userId) {
        Cart cart = getCartByUserId(userId);
        List<Map<String, Object>> itemsWithDetails = new ArrayList<>();

        for (Cart.CartItem item : cart.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                Map<String, Object> map = new HashMap<>();
                map.put("productId", product.getId());
                map.put("name", product.getName());
                map.put("price", product.getPrice());
                map.put("image", product.getImage());
                map.put("category", product.getCategory());
                map.put("quantity", item.getQuantity());
                itemsWithDetails.add(map);
            });
        }
        return itemsWithDetails;
    }

    public Cart addToCart(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        
        boolean found = false;
        for (Cart.CartItem item : cart.getItems()) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(item.getQuantity() + quantity);
                found = true;
                break;
            }
        }
        
        if (!found) {
            cart.getItems().add(new Cart.CartItem(productId, quantity));
        }
        
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        
        if (quantity <= 0) {
            cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        } else {
            for (Cart.CartItem item : cart.getItems()) {
                if (item.getProductId().equals(productId)) {
                    item.setQuantity(quantity);
                    break;
                }
            }
        }
        
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
