package com.touragency.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long packageId;
    private Integer rating;
    private String comment;
}
