package com.touragency.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type; // e.g., "BOOKING", "PAYMENT", "SYSTEM", etc.
    private boolean read;
    private LocalDateTime createdAt;
    private Long userId;
    private String actionUrl; // Optional URL to navigate to when clicking the notification
}
