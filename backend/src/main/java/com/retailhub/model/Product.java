package com.retailhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "product details")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private String category;
    private String image;
    private Integer stock = 0;
    private Integer rating = 0;
    private Integer reviews = 0;
    private Integer discount = 0;
    private String status = "Active";

    public Product() {}
    
    public Product(String name, String category, Double price, Double originalPrice, Integer stock, Integer rating, Integer reviews, Integer discount, String status) {
        this.name = name; this.category = category; this.price = price; this.originalPrice = originalPrice;
        this.stock = stock; this.rating = rating; this.reviews = reviews; this.discount = discount; this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }
    public Integer getDiscount() { return discount; }
    public void setDiscount(Integer discount) { this.discount = discount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
