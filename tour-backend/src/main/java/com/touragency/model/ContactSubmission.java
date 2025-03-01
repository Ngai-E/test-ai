package com.touragency.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    private String phone;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false, length = 2000)
    private String message;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;
    
    @Column(length = 2000)
    private String response;
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
    
    @Column(name = "responded_by")
    private String respondedBy;
    
    public enum SubmissionStatus {
        NEW,
        IN_PROGRESS,
        RESPONDED,
        CLOSED
    }
}
