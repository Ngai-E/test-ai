package com.touragency.controller;

import com.touragency.dto.ReviewRequest;
import com.touragency.model.Review;
import com.touragency.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<Review>> getPackageReviews(@PathVariable Long packageId) {
        List<Review> reviews = reviewService.getPackageReviews(packageId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<Review> createReview(@PathVariable Long userId, @RequestBody ReviewRequest reviewRequest) {
        Review review = reviewService.createReview(userId, reviewRequest);
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId, @PathVariable Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok().build();
    }
}
