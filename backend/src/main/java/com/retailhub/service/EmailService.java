package com.retailhub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendOrderConfirmationEmail(String to, String orderId, double totalAmount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@retailhub.com");
            message.setTo(to);
            message.setSubject("Order Confirmation - RetailHub");
            message.setText("Dear Customer,\n\nYour order (ID: " + orderId + ") has been placed successfully. " +
                    "Total Amount: ₹" + totalAmount + "\n\nThank you for shopping with us!");

            javaMailSender.send(message);
            logger.info("Order confirmation email sent successfully to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to {}. Ensure SMTP configuration is valid in application.properties. Reason: {}", to, e.getMessage());
        }
    }
}
