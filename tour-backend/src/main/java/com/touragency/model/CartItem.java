package com.touragency.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "package_id")
    private Package tourPackage;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    private BigDecimal basePrice;
    private LocalDateTime addedAt;
    
    @OneToMany(mappedBy = "cartItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItemAddon> addons = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
