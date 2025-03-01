package com.touragency.controller;

import com.touragency.dto.UserResponse;
import com.touragency.dto.UserUpdateRequest;
import com.touragency.model.Package;
import com.touragency.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "User Management", description = "APIs for managing user profiles and wishlist")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Operation(summary = "Get user wishlist", description = "Retrieves all packages in a user's wishlist")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved wishlist", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)))
    @GetMapping("/{userId}/wishlist")
    public ResponseEntity<Set<Package>> getWishlist(
            @Parameter(description = "ID of the user to get wishlist for") @PathVariable Long userId) {
        Set<Package> wishlist = userService.getWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }
    
    @Operation(summary = "Add package to wishlist", description = "Adds a package to a user's wishlist")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Package successfully added to wishlist", content = @Content),
        @ApiResponse(responseCode = "404", description = "User or package not found", content = @Content)
    })
    @PostMapping("/{userId}/wishlist/{packageId}")
    public ResponseEntity<Void> addToWishlist(
            @Parameter(description = "ID of the user") @PathVariable Long userId, 
            @Parameter(description = "ID of the package to add to wishlist") @PathVariable Long packageId) {
        userService.addToWishlist(userId, packageId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "Remove package from wishlist", description = "Removes a package from a user's wishlist")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Package successfully removed from wishlist", content = @Content),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @DeleteMapping("/{userId}/wishlist/{packageId}")
    public ResponseEntity<Void> removeFromWishlist(
            @Parameter(description = "ID of the user") @PathVariable Long userId, 
            @Parameter(description = "ID of the package to remove from wishlist") @PathVariable Long packageId) {
        userService.removeFromWishlist(userId, packageId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "Check if package is in wishlist", description = "Checks if a package is in a user's wishlist")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully checked wishlist status", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/{userId}/wishlist/{packageId}")
    public ResponseEntity<Boolean> isPackageInWishlist(
            @Parameter(description = "ID of the user") @PathVariable Long userId, 
            @Parameter(description = "ID of the package to check") @PathVariable Long packageId) {
        boolean isInWishlist = userService.isPackageInWishlist(userId, packageId);
        return ResponseEntity.ok(isInWishlist);
    }
    
    @Operation(summary = "Get user profile", description = "Retrieves a user's profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        UserResponse userResponse = userService.getUserProfile(userId);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Get user profile", description = "Retrieves a user's profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserResponse> getUserProfileInfo(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        UserResponse userResponse = userService.getUserProfile(userId);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Update user profile", description = "Updates a user's profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated user profile", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
        @ApiResponse(responseCode = "400", description = "Invalid request data", content = @Content)
    })
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUserProfile(
            @Parameter(description = "ID of the user") @PathVariable Long userId,
            @Parameter(description = "Updated user information") @RequestBody UserUpdateRequest request) {
        UserResponse userResponse = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Generate coupon for user", description = "Generates a coupon from user's coin balance")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Coupon successfully generated", content = @Content),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
        @ApiResponse(responseCode = "400", description = "Insufficient coin balance", content = @Content)
    })
    @PostMapping("/{userId}/generate-coupon")
    public ResponseEntity<Void> generateCoupon(
            @Parameter(description = "ID of the user") @PathVariable Long userId, 
            @Parameter(description = "Value of the coupon to generate") @RequestParam Double value) {
        userService.generateCoupon(userId, value);
        return ResponseEntity.ok().build();
    }
}
