package com.touragency.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "addons")
public class Addon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @Column(length = 1000)
    private String detailedDescription;
    
    private BigDecimal price;
    private String imageUrl;
    private String videoUrl;
    private String category; // ACCOMMODATION, TRANSPORTATION, ACTIVITY, MEAL, etc.
    
    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonBackReference
    private Package tourPackage;
}
