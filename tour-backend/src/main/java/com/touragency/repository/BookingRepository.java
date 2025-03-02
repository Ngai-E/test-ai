package com.touragency.repository;

import com.touragency.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByUserIdAndBookingStatus(Long userId, String status);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByTourPackageId(Long packageId);
    
    // Admin-specific methods
    long countByCreatedAtAfter(LocalDateTime date);
    List<Booking> findByBookingStatusNot(String status);
    List<Booking> findByBookingStatusNotAndCreatedAtAfter(String status, LocalDateTime date);
}
