package com.touragency.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "packages")
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private String country;
    private String image;
    private String overview;
    private Integer duration;
    private String groupSize;
    private String transportation;
    private String accommodation;
    private String meals;
    private String bestTimeToVisit;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackageType> packageTypes = new ArrayList<>();
    
    @JsonManagedReference
    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryDay> itinerary = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "package_highlights", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "included_items", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "item")
    private List<String> included = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "excluded_items", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "item")
    private List<String> excluded = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        // createdAt = LocalDateTime.now();
        // updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        // updatedAt = LocalDateTime.now();
    }
}
