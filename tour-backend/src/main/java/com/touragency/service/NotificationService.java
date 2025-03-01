package com.touragency.service;

import com.touragency.dto.NotificationResponse;
import com.touragency.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;
    
    // In-memory storage for notifications (in a real app, this would be in a database)
    private final Map<Long, List<NotificationResponse>> userNotifications = new HashMap<>();
    private Long nextNotificationId = 1L;

    public List<NotificationResponse> getUserNotifications(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        
        // Initialize with sample data if empty
        if (!userNotifications.containsKey(userId)) {
            initializeSampleNotifications(userId);
        }
        
        return userNotifications.getOrDefault(userId, new ArrayList<>());
    }
    
    public void markNotificationAsRead(Long notificationId) {
        // Find the notification in any user's list
        for (List<NotificationResponse> notifications : userNotifications.values()) {
            for (NotificationResponse notification : notifications) {
                if (notification.getId().equals(notificationId)) {
                    notification.setRead(true);
                    return;
                }
            }
        }
        
        throw new RuntimeException("Notification not found");
    }
    
    public void markAllNotificationsAsRead(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        
        List<NotificationResponse> notifications = userNotifications.get(userId);
        if (notifications != null) {
            notifications.forEach(notification -> notification.setRead(true));
        }
    }
    
    // Helper method to create a notification
    public void createNotification(Long userId, String title, String message, String type, String actionUrl) {
        if (!userNotifications.containsKey(userId)) {
            userNotifications.put(userId, new ArrayList<>());
        }
        
        NotificationResponse notification = new NotificationResponse(
                nextNotificationId++,
                title,
                message,
                type,
                false,
                LocalDateTime.now(),
                userId,
                actionUrl
        );
        
        userNotifications.get(userId).add(notification);
    }
    
    private void initializeSampleNotifications(Long userId) {
        List<NotificationResponse> notifications = new ArrayList<>();
        
        notifications.add(new NotificationResponse(
                nextNotificationId++,
                "Welcome to Tour Agency",
                "Thank you for joining our platform. Explore our packages and start your journey!",
                "SYSTEM",
                false,
                LocalDateTime.now().minusDays(5),
                userId,
                "/packages"
        ));
        
        notifications.add(new NotificationResponse(
                nextNotificationId++,
                "Special Offer",
                "Get 15% off on all European destinations this month!",
                "PROMOTION",
                false,
                LocalDateTime.now().minusDays(2),
                userId,
                "/packages/region/Europe"
        ));
        
        notifications.add(new NotificationResponse(
                nextNotificationId++,
                "Earn Coins",
                "Refer friends and earn coins that you can use for discounts on your next booking.",
                "REWARD",
                false,
                LocalDateTime.now().minusDays(1),
                userId,
                "/rewards"
        ));
        
        userNotifications.put(userId, notifications);
    }
}
