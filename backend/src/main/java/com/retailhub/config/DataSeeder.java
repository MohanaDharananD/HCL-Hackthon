package com.retailhub.config;

import com.retailhub.model.Product;
import com.retailhub.model.User;
import com.retailhub.repository.ProductRepository;
import com.retailhub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@retailhub.com")) {
            User admin = new User("Admin", "admin@retailhub.com", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@retailhub.com / admin123");
        }

        if (!userRepository.existsByEmail("user@retailhub.com")) {
            User user = new User("Demo User", "user@retailhub.com", passwordEncoder.encode("user123"), "USER");
            userRepository.save(user);
            log.info("✅ Demo user created: user@retailhub.com / user123");
        }

        if (productRepository.count() > 0) {
            productRepository.deleteAll(); // Wipe old imageless products
        }

        List<Product> products = List.of(
            createProduct("Wireless Bluetooth Headphones", "Electronics", 2499.0, 4999.0, 45, 5, 234, 50, "Active", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"),
            createProduct("Premium Cotton T-Shirt", "Fashion", 799.0, 1299.0, 120, 4, 167, 38, "Active", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"),
            createProduct("Stainless Steel Water Bottle", "Home & Kitchen", 599.0, null, 90, 4, 89, 0, "Active", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"),
            createProduct("Smart Fitness Band", "Electronics", 1999.0, 3499.0, 30, 5, 312, 43, "Active", "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80"),
            createProduct("Organic Green Tea (100 bags)", "Groceries", 449.0, null, 200, 4, 56, 0, "Active", "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80"),
            createProduct("Running Shoes - Ultra Light", "Fashion", 3299.0, 5999.0, 28, 5, 420, 45, "Active", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"),
            createProduct("Ceramic Coffee Mug Set (4 pcs)", "Home & Kitchen", 899.0, null, 8, 4, 78, 0, "Low Stock", "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80"),
            createProduct("USB-C Fast Charger 65W", "Electronics", 1299.0, 1999.0, 55, 4, 198, 35, "Active", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80"),
            createProduct("Yoga Mat - Premium Grip", "Sports", 1499.0, 2499.0, 40, 5, 145, 40, "Active", "https://images.unsplash.com/photo-1599815598696-6b222384784a?w=500&q=80"),
            createProduct("Bamboo Cutting Board", "Home & Kitchen", 699.0, null, 65, 4, 63, 0, "Active", "https://images.unsplash.com/photo-1629198688000-71f23e745f6e?w=500&q=80"),
            createProduct("Wireless Mouse - Ergonomic", "Electronics", 999.0, 1599.0, 70, 4, 287, 37, "Active", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"),
            createProduct("Leather Wallet - Slim Design", "Fashion", 1199.0, 1999.0, 50, 5, 192, 40, "Active", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80")
        );
        productRepository.saveAll(products);
        log.info("✅ {} demo products seeded", products.size());
    }

    private Product createProduct(String name, String category, Double price, Double originalPrice, Integer stock, Integer rating, Integer reviews, Integer discount, String status, String image) {
        Product p = new Product(name, category, price, originalPrice, stock, rating, reviews, discount, status);
        p.setImage(image);
        return p;
    }
}
