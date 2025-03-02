package com.touragency.config;

import com.touragency.model.Role;
import com.touragency.model.User;
import com.touragency.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Component that seeds an admin user on application startup if one doesn't exist.
 */
@Component
public class AdminUserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user exists
        if (!userRepository.existsByPhoneNumber("+237650931636")) {
            User adminUser = new User();
            adminUser.setPhoneNumber("+237650931636");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFullName("System Administrator");
            adminUser.setEmail("admin@touragency.com");
            adminUser.setCoinBalance(0);
            adminUser.setRole(Role.ADMIN);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(adminUser);
            
            System.out.println("Admin user created successfully");
        }
    }
}
