package com.touragency.dto;

import com.touragency.model.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String phoneNumber;
    private String fullName;
    private String email;
    private Integer coinBalance;
    private String referralCode;
    private String token; // JWT token for authentication
    private Role role;
}
