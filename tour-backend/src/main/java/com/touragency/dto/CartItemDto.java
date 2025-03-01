package com.touragency.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CartItemDto {
    private Long id;
    private Long userId;
    
    // Simplified package data
    private Long packageId;
    private String packageName;
    private String packageImage;
    private String packageCountry;
    private Integer packageDuration;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    private BigDecimal basePrice;
    private LocalDateTime addedAt;
    
    private List<CartItemAddonDto> addons = new ArrayList<>();
    
    @Getter
    @Setter
    public static class CartItemAddonDto {
        private Long id;
        private Long addonId;
        private String addonName;
        private String addonDescription;
        private Integer quantity;
        private BigDecimal price;
    }
}
