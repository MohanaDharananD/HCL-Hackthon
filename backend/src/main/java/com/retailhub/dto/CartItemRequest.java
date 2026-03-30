package com.retailhub.dto;
public class CartItemRequest {
    private String productId;
    private Integer quantity;

    public CartItemRequest() {}

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String productId() { return productId; }
    public Integer quantity() { return quantity; }
}
