package com.touragency.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "faqs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQ {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String question;
    
    @Column(nullable = false, length = 2000)
    private String answer;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "display_order", nullable = false)
    private int displayOrder;
    
    @Column(name = "is_active", nullable = false)
    private boolean active;
}
