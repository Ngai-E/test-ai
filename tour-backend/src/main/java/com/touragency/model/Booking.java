package com.touragency.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-bookings")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonIgnoreProperties({"addons", "itinerary", "highlights", "included", "excluded", "reviews", "wishlistedBy"})
    private Package tourPackage;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    private BigDecimal totalPrice;
    private String bookingStatus; // BOOKED, CANCELLED, COMPLETED
    private String paymentStatus; // PENDING, PAID, REFUNDED
    private String bookingReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String couponCode;
    private BigDecimal discountAmount;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("booking")
    private List<BookingAddon> addons = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        bookingReference = generateBookingReference();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    private String generateBookingReference() {
        // Simple implementation - in a real app, ensure uniqueness
        return "BK" + System.currentTimeMillis() % 10000;
    }
}
