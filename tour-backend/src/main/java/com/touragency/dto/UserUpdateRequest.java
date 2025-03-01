package com.touragency.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String currentPassword;
    private String newPassword;
}
