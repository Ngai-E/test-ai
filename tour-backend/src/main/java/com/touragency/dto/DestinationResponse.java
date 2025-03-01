package com.touragency.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DestinationResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String region;
    private String country;
    private int popularity; // Indicates how popular the destination is (e.g., based on bookings)
    private double rating; // Average rating from reviews
}
