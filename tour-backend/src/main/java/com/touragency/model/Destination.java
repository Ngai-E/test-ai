package com.touragency.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destination {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, length = 2000)
    private String description;
    
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @Column(nullable = false)
    private String country;
    
    @Column(nullable = false)
    private String region;
    
    @Column(name = "is_featured", nullable = false)
    private boolean featured;
    
    private BigDecimal latitude;
    
    private BigDecimal longitude;
}
