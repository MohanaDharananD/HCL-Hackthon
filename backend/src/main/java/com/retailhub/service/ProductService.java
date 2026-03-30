package com.retailhub.service;

import com.retailhub.model.Product;
import com.retailhub.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updated) {
        Product existing = getProductById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setCategory(updated.getCategory());
        existing.setImage(updated.getImage());
        existing.setStock(updated.getStock());
        existing.setDiscount(updated.getDiscount());
        existing.setStatus(updated.getStatus());
        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
