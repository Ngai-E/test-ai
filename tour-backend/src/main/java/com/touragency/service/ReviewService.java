package com.touragency.service;

import com.touragency.dto.ReviewRequest;
import com.touragency.model.Package;
import com.touragency.model.Review;
import com.touragency.model.User;
import com.touragency.repository.PackageRepository;
import com.touragency.repository.ReviewRepository;
import com.touragency.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.OptionalDouble;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    public List<Review> getPackageReviews(Long packageId) {
        return reviewRepository.findByTourPackageId(packageId);
    }
    
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    @Transactional
    public Review createReview(Long userId, ReviewRequest reviewRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Package tourPackage = packageRepository.findById(reviewRequest.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        Review review = new Review();
        review.setUser(user);
        review.setTourPackage(tourPackage);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        
        Review savedReview = reviewRepository.save(review);
        
        // Update package average rating
        tourPackage.updateAverageRating();
        packageRepository.save(tourPackage);
        
        return savedReview;
    }
    
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this review");
        }
        
        Package tourPackage = review.getTourPackage();
        reviewRepository.delete(review);
        
        // Update package average rating
        tourPackage.updateAverageRating();
        packageRepository.save(tourPackage);
    }
    
    // Admin-specific methods
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    @Transactional
    public void adminDeleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        Package tourPackage = review.getTourPackage();
        reviewRepository.delete(review);
        
        // Update package average rating
        tourPackage.updateAverageRating();
        packageRepository.save(tourPackage);
    }
    
    public long getTotalReviewCount() {
        return reviewRepository.count();
    }
    
    public double getAverageRating() {
        List<Review> allReviews = reviewRepository.findAll();
        if (allReviews.isEmpty()) {
            return 0.0;
        }
        
        OptionalDouble average = allReviews.stream()
                .mapToDouble(Review::getRating)
                .average();
        
        return average.orElse(0.0);
    }
    
    public List<Review> getRecentReviews(int limit) {
        return reviewRepository.findAll(org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }
}
