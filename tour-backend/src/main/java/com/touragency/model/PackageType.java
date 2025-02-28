package com.touragency.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "package_types")
public class PackageType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double price;
    private String description;
    
    @Column(length = 1000)
    private String detailedDescription;
    
    private String accommodationType;
    private String transferType;
    
    @ElementCollection
    @CollectionTable(name = "package_type_features", joinColumns = @JoinColumn(name = "package_type_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "package_type_activities", joinColumns = @JoinColumn(name = "package_type_id"))
    @Column(name = "activity")
    private List<String> specialActivities = new ArrayList<>();
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "package_id")
    private Package tourPackage;
}
