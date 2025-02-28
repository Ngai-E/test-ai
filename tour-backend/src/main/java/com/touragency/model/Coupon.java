package com.touragency.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String code;
    
    private BigDecimal value;
    private String type; // PERCENTAGE, FIXED
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Boolean isUsed = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // The user who generated this coupon
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
