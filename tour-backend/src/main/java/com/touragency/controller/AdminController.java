package com.touragency.controller;

import com.touragency.dto.UserResponse;
import com.touragency.model.*;
import com.touragency.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import com.touragency.model.Package;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PackageService packageService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private AddonService addonService;
    
    @Autowired
    private ItineraryService itineraryService;

    // User management endpoints
    
    @Operation(summary = "Get all users", description = "Retrieves all users in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved users")
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @Operation(summary = "Get user details", description = "Retrieves detailed information about a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user details"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserDetails(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        User user = userService.getUserDetails(userId);
        return ResponseEntity.ok(user);
    }
    
    @Operation(summary = "Update user", description = "Updates a user's information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated user"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @Parameter(description = "ID of the user") @PathVariable Long userId,
            @RequestBody User user) {
        UserResponse updatedUser = userService.adminUpdateUser(userId, user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @Operation(summary = "Delete user", description = "Deletes a user from the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted user"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
    
    // Package management endpoints

    @Operation(summary = "Get all packages", description = "Retrieves a list of all available tour packages")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of packages",
            content = @Content(mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Package.class))))
    @GetMapping("/packages")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }
    
    @Operation(summary = "Create package", description = "Creates a new tour package")
    @ApiResponse(responseCode = "200", description = "Successfully created package")
    @PostMapping("/packages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Package> createPackage(@RequestBody Package tourPackage) {
        Package createdPackage = packageService.createPackage(tourPackage);
        return ResponseEntity.ok(createdPackage);
    }

    @Operation(summary = "Get package by ID", description = "Retrieves a specific tour package by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the package",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class))),
            @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping("/packages/{packageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Package> getPackageById(
            @Parameter(description = "ID of the package to retrieve") @PathVariable Long packageId) {
        return packageService.getPackageById(packageId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Update package", description = "Updates an existing tour package")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated package"),
        @ApiResponse(responseCode = "404", description = "Package not found")
    })
    @PutMapping("/packages/{packageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Package> updatePackage(
            @Parameter(description = "ID of the package") @PathVariable Long packageId,
            @RequestBody Package tourPackage) {
        return packageService.updatePackage(packageId, tourPackage)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Delete package", description = "Deletes a tour package")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted package"),
        @ApiResponse(responseCode = "404", description = "Package not found")
    })
    @DeleteMapping("/packages/{packageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePackage(
            @Parameter(description = "ID of the package") @PathVariable Long packageId) {
        boolean deleted = packageService.deletePackage(packageId);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Addon management endpoints
    
    @Operation(summary = "Get package addons", description = "Retrieves all addons for a specific package")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved addons")
    @GetMapping("/packages/{packageId}/addons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Addon>> getPackageAddons(
            @Parameter(description = "ID of the package") @PathVariable Long packageId) {
        List<Addon> addons = addonService.getPackageAddons(packageId);
        return ResponseEntity.ok(addons);
    }
    
    @Operation(summary = "Create addon", description = "Creates a new addon for a package")
    @ApiResponse(responseCode = "200", description = "Successfully created addon")
    @PostMapping("/packages/{packageId}/addons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Addon> createAddon(
            @Parameter(description = "ID of the package") @PathVariable Long packageId,
            @RequestBody Addon addon) {
        Addon createdAddon = addonService.createAddon(packageId, addon);
        return ResponseEntity.ok(createdAddon);
    }
    
    @Operation(summary = "Update addon", description = "Updates an existing addon")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated addon"),
        @ApiResponse(responseCode = "404", description = "Addon not found")
    })
    @PutMapping("/addons/{addonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Addon> updateAddon(
            @Parameter(description = "ID of the addon") @PathVariable Long addonId,
            @RequestBody Addon addon) {
        Addon updatedAddon = addonService.updateAddon(addonId, addon);
        return ResponseEntity.ok(updatedAddon);
    }
    
    @Operation(summary = "Delete addon", description = "Deletes an addon")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted addon"),
        @ApiResponse(responseCode = "404", description = "Addon not found")
    })
    @DeleteMapping("/addons/{addonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAddon(
            @Parameter(description = "ID of the addon") @PathVariable Long addonId) {
        addonService.deleteAddon(addonId);
        return ResponseEntity.ok().build();
    }
    
    // Itinerary management endpoints
    
    @Operation(summary = "Get package itinerary", description = "Retrieves the itinerary for a specific package")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved itinerary")
    @GetMapping("/packages/{packageId}/itinerary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ItineraryDay>> getPackageItinerary(
            @Parameter(description = "ID of the package") @PathVariable Long packageId) {
        List<ItineraryDay> itinerary = itineraryService.getPackageItinerary(packageId);
        return ResponseEntity.ok(itinerary);
    }
    
    @Operation(summary = "Create itinerary day", description = "Creates a new itinerary day for a package")
    @ApiResponse(responseCode = "200", description = "Successfully created itinerary day")
    @PostMapping("/packages/{packageId}/itinerary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItineraryDay> createItineraryDay(
            @Parameter(description = "ID of the package") @PathVariable Long packageId,
            @RequestBody ItineraryDay itineraryDay) {
        ItineraryDay createdDay = itineraryService.createItineraryDay(packageId, itineraryDay);
        return ResponseEntity.ok(createdDay);
    }
    
    @Operation(summary = "Update itinerary day", description = "Updates an existing itinerary day")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated itinerary day"),
        @ApiResponse(responseCode = "404", description = "Itinerary day not found")
    })
    @PutMapping("/itinerary/{dayId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItineraryDay> updateItineraryDay(
            @Parameter(description = "ID of the itinerary day") @PathVariable Long dayId,
            @RequestBody ItineraryDay itineraryDay) {
        ItineraryDay updatedDay = itineraryService.updateItineraryDay(dayId, itineraryDay);
        return ResponseEntity.ok(updatedDay);
    }
    
    @Operation(summary = "Delete itinerary day", description = "Deletes an itinerary day")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted itinerary day"),
        @ApiResponse(responseCode = "404", description = "Itinerary day not found")
    })
    @DeleteMapping("/itinerary/{dayId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItineraryDay(
            @Parameter(description = "ID of the itinerary day") @PathVariable Long dayId) {
        itineraryService.deleteItineraryDay(dayId);
        return ResponseEntity.ok().build();
    }
    
    // Booking management endpoints
    
    @Operation(summary = "Get all bookings", description = "Retrieves all bookings in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings")
    @GetMapping("/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @Operation(summary = "Update booking status", description = "Updates the status of a booking")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated booking status"),
        @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/bookings/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @Parameter(description = "ID of the booking") @PathVariable Long bookingId,
            @Parameter(description = "New booking status") @RequestParam String status) {
        Booking updatedBooking = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }
    
    // Review management endpoints
    
    @Operation(summary = "Get all reviews", description = "Retrieves all reviews in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews")
    @GetMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @Operation(summary = "Delete review", description = "Deletes a review from the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted review"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/reviews/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "ID of the review") @PathVariable Long reviewId) {
        reviewService.adminDeleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
    
    // Dashboard statistics
    
    @Operation(summary = "Get dashboard statistics", description = "Retrieves statistics for the admin dashboard")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics")
    @GetMapping("/dashboard/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // User statistics
        statistics.put("totalUsers", userService.getTotalUserCount());
        statistics.put("newUsersThisMonth", userService.getNewUsersThisMonth());
        
        // Booking statistics
        statistics.put("totalBookings", bookingService.getTotalBookingCount());
        statistics.put("bookingsThisMonth", bookingService.getBookingsThisMonth());
        statistics.put("totalRevenue", bookingService.getTotalRevenue());
        statistics.put("revenueThisMonth", bookingService.getRevenueThisMonth());
        
        // Package statistics
        statistics.put("totalPackages", packageService.getTotalPackageCount());
        statistics.put("mostPopularPackage", packageService.getMostPopularPackage());
        
        // Review statistics
        statistics.put("totalReviews", reviewService.getTotalReviewCount());
        statistics.put("averageRating", reviewService.getAverageRating());
        
        return ResponseEntity.ok(statistics);
    }
    
    @Operation(summary = "Get popular packages", description = "Retrieves the most popular packages based on booking count")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved popular packages")
    @GetMapping("/packages/popular")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Package>> getPopularPackages(
            @RequestParam(defaultValue = "5") int limit) {
        List<Package> popularPackages = packageService.getPopularPackages(limit);
        return ResponseEntity.ok(popularPackages);
    }
    
    @Operation(summary = "Get recent bookings", description = "Retrieves the most recent bookings")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved recent bookings")
    @GetMapping("/bookings/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getRecentBookings(
            @RequestParam(defaultValue = "5") int limit) {
        List<Booking> recentBookings = bookingService.getRecentBookings(limit);
        return ResponseEntity.ok(recentBookings);
    }
    
    @Operation(summary = "Get recent reviews", description = "Retrieves the most recent reviews")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved recent reviews")
    @GetMapping("/reviews/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getRecentReviews(
            @RequestParam(defaultValue = "5") int limit) {
        List<Review> recentReviews = reviewService.getRecentReviews(limit);
        return ResponseEntity.ok(recentReviews);
    }
    
    @Operation(summary = "Get revenue by month", description = "Retrieves revenue data grouped by month")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved revenue data")
    @GetMapping("/bookings/revenue-by-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByMonth(
            @RequestParam(defaultValue = "6") int months) {
        List<Map<String, Object>> revenueData = bookingService.getRevenueByMonth(months);
        return ResponseEntity.ok(revenueData);
    }
}
