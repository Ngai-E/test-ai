package com.touragency.controller;

import com.touragency.dto.BookingRequest;
import com.touragency.model.Booking;
import com.touragency.model.Coupon;
import com.touragency.service.BookingService;
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

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Booking Management", description = "APIs for managing tour bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Operation(summary = "Get user bookings", description = "Retrieves all bookings for a specific user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of bookings", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class)))
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(
            @Parameter(description = "ID of the user to get bookings for") @PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @Operation(summary = "Get user bookings by status", description = "Retrieves all bookings for a specific user filtered by status")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of bookings", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class)))
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Booking>> getUserBookingsByStatus(
            @Parameter(description = "ID of the user to get bookings for") @PathVariable Long userId, 
            @Parameter(description = "Status to filter bookings by (e.g., BOOKED, CANCELLED)") @PathVariable String status) {
        List<Booking> bookings = bookingService.getUserBookingsByStatus(userId, status);
        return ResponseEntity.ok(bookings);
    }
    
    @Operation(summary = "Create a new booking", description = "Creates a new booking for a specific user")
    @ApiResponse(responseCode = "200", description = "Booking successfully created", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class)))
    @PostMapping("/user/{userId}")
    public ResponseEntity<Booking> createBooking(
            @Parameter(description = "ID of the user creating the booking") @PathVariable Long userId,
            @Parameter(description = "Booking request details", required = true) @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(userId, request);
        return ResponseEntity.ok(booking);
    }
    
    @Operation(summary = "Cancel a booking", description = "Cancels an existing booking for a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booking successfully cancelled", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class))),
        @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content),
        @ApiResponse(responseCode = "403", description = "User not authorized to cancel this booking", content = @Content)
    })
    @PutMapping("/{bookingId}/user/{userId}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @Parameter(description = "ID of the booking to cancel") @PathVariable Long bookingId,
            @Parameter(description = "ID of the user cancelling the booking") @PathVariable Long userId) {
        Booking booking = bookingService.cancelBooking(userId, bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @Operation(summary = "Validate coupon code", description = "Validates a coupon code and returns its details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Coupon code is valid", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Coupon.class))),
        @ApiResponse(responseCode = "404", description = "Coupon code not found or invalid", content = @Content)
    })
    @GetMapping("/coupons/{code}")
    public ResponseEntity<Coupon> validateCoupon(
            @Parameter(description = "Coupon code to validate") @PathVariable String code) {
        Coupon coupon = bookingService.validateCoupon(code);
        return ResponseEntity.ok(coupon);
    }

    @Operation(summary = "Get booking by ID", description = "Retrieves a specific booking by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved booking", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class))),
        @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content)
    })
    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(
            @Parameter(description = "ID of the booking to retrieve") @PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @Operation(summary = "Get user booking by ID", description = "Retrieves a specific booking for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved booking", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class))),
        @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content),
        @ApiResponse(responseCode = "403", description = "User not authorized to view this booking", content = @Content)
    })
    @GetMapping("/user/{userId}/booking/{bookingId}")
    public ResponseEntity<Booking> getUserBookingById(
            @Parameter(description = "ID of the user") @PathVariable Long userId,
            @Parameter(description = "ID of the booking to retrieve") @PathVariable Long bookingId) {
        Booking booking = bookingService.getUserBookingById(userId, bookingId);
        return ResponseEntity.ok(booking);
    }

    @Operation(summary = "Get bookings by package", description = "Retrieves all bookings for a specific package")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Booking.class))),
        @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<Booking>> getBookingsByPackage(
            @Parameter(description = "ID of the package") @PathVariable Long packageId) {
        List<Booking> bookings = bookingService.getBookingsByPackage(packageId);
        return ResponseEntity.ok(bookings);
    }
}
