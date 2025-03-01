package com.touragency.service;

import com.touragency.dto.LoginRequest;
import com.touragency.dto.RegisterRequest;
import com.touragency.dto.UserResponse;
import com.touragency.dto.UserUpdateRequest;
import com.touragency.model.Package;
import com.touragency.model.User;
import com.touragency.repository.PackageRepository;
import com.touragency.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }
        
        User user = new User();
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        
        // Handle referral if provided
        if (request.getReferralCode() != null && !request.getReferralCode().isEmpty()) {
            Optional<User> referrer = userRepository.findByReferralCode(request.getReferralCode());
            if (referrer.isPresent()) {
                User referrerUser = referrer.get();
                referrerUser.setCoinBalance(referrerUser.getCoinBalance() + 50); // Award 50 coins for referral
                userRepository.save(referrerUser);
            }
        }
        
        User savedUser = userRepository.save(user);
        return createUserResponse(savedUser);
    }
    
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        return createUserResponse(user);
    }
    
    public void addToWishlist(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        user.getWishlist().add(tourPackage);
        userRepository.save(user);
    }
    
    public void removeFromWishlist(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getWishlist().removeIf(p -> p.getId().equals(packageId));
        userRepository.save(user);
    }
    
    public Set<Package> getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getWishlist();
    }
    
    public boolean isPackageInWishlist(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getWishlist().stream()
                .anyMatch(p -> p.getId().equals(packageId));
    }
    
    public void generateCoupon(Long userId, double value) {
        // Implementation for generating a coupon from user's coin balance
    }
    
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return createUserResponse(user);
    }
    
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update user fields if provided
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        // Update password if provided
        if (request.getCurrentPassword() != null && !request.getCurrentPassword().isEmpty() 
                && request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return createUserResponse(updatedUser);
    }
    
    private UserResponse createUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setCoinBalance(user.getCoinBalance());
        response.setReferralCode(user.getReferralCode());
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getId().toString());
        response.setToken(token);
        
        return response;
    }
}
