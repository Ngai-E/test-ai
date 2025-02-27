package com.touragency.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "itinerary_days")
public class ItineraryDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer dayNumber;
    private String title;
    private String description;
    private String accommodation;
    private String meals;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private Package tourPackage;
    
    @ElementCollection
    @CollectionTable(name = "itinerary_day_activities", joinColumns = @JoinColumn(name = "day_id"))
    @Column(name = "activity")
    private List<String> activities = new ArrayList<>();
}
