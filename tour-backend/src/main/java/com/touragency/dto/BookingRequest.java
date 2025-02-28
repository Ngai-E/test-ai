package com.touragency.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    private Long packageId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    private List<AddonSelectionDto> selectedAddons;
    private String couponCode; // Optional
}
