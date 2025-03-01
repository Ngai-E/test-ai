package com.touragency.controller;

import com.touragency.dto.ReviewRequest;
import com.touragency.model.Review;
import com.touragency.service.ReviewService;
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
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Review", description = "Review management APIs")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @Operation(summary = "Get package reviews", description = "Retrieves all reviews for a specific package")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Review.class)))
    })
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<Review>> getPackageReviews(
            @Parameter(description = "ID of the package") @PathVariable Long packageId) {
        List<Review> reviews = reviewService.getPackageReviews(packageId);
        return ResponseEntity.ok(reviews);
    }
    
    @Operation(summary = "Get user reviews", description = "Retrieves all reviews created by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Review.class)))
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        List<Review> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @Operation(summary = "Create review", description = "Creates a new review for a package")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Review successfully created", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Review.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data", content = @Content)
    })
    @PostMapping("/user/{userId}")
    public ResponseEntity<Review> createReview(
            @Parameter(description = "ID of the user creating the review") @PathVariable Long userId, 
            @Parameter(description = "Review details") @RequestBody ReviewRequest reviewRequest) {
        Review review = reviewService.createReview(userId, reviewRequest);
        return ResponseEntity.ok(review);
    }
    
    @Operation(summary = "Delete review", description = "Deletes a review created by a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Review successfully deleted", content = @Content),
        @ApiResponse(responseCode = "404", description = "Review not found", content = @Content),
        @ApiResponse(responseCode = "403", description = "User not authorized to delete this review", content = @Content)
    })
    @DeleteMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "ID of the review to delete") @PathVariable Long reviewId, 
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok().build();
    }
}
