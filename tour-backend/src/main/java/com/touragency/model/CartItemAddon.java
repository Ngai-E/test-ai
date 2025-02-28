package com.touragency.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "cart_item_addons")
public class CartItemAddon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cart_item_id")
    private CartItem cartItem;
    
    @ManyToOne
    @JoinColumn(name = "addon_id")
    private Addon addon;
    
    private Integer quantity;
    private BigDecimal price;
}
