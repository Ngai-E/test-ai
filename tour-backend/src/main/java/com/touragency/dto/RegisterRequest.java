package com.touragency.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String phoneNumber;
    private String password;
    private String fullName;
    private String email;
    private String referralCode; // Optional - referral code of the person who referred this user
}
