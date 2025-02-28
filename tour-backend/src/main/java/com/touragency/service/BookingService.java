package com.touragency.service;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.dto.BookingRequest;
import com.touragency.model.*;
import com.touragency.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Autowired
    private AddonRepository addonRepository;
    
    @Autowired
    private CouponRepository couponRepository;
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getUserBookingsByStatus(Long userId, String status) {
        return bookingRepository.findByUserIdAndBookingStatus(userId, status);
    }
    
    @Transactional
    public Booking createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.touragency.model.Package tourPackage = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTourPackage(tourPackage);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setNumberOfAdults(request.getNumberOfAdults());
        booking.setNumberOfChildren(request.getNumberOfChildren());
        
        // Calculate total price
        BigDecimal totalPrice = calculateTotalPrice(tourPackage, request.getNumberOfAdults(), 
                request.getNumberOfChildren(), request.getSelectedAddons());
        
        // Apply coupon if provided
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
            
            if (coupon.getIsUsed()) {
                throw new RuntimeException("Coupon has already been used");
            }
            
            // Apply discount
            BigDecimal discountAmount;
            if ("PERCENTAGE".equals(coupon.getType())) {
                discountAmount = totalPrice.multiply(coupon.getValue().divide(BigDecimal.valueOf(100)));
            } else {
                discountAmount = coupon.getValue();
            }
            
            totalPrice = totalPrice.subtract(discountAmount);
            booking.setCouponCode(coupon.getCode());
            booking.setDiscountAmount(discountAmount);
            
            // Mark coupon as used
            coupon.setIsUsed(true);
            couponRepository.save(coupon);
        }
        
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus("BOOKED");
        booking.setPaymentStatus("PENDING");
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Add selected addons
        if (request.getSelectedAddons() != null && !request.getSelectedAddons().isEmpty()) {
            for (AddonSelectionDto addonSelection : request.getSelectedAddons()) {
                Addon addon = addonRepository.findById(addonSelection.getAddonId())
                        .orElseThrow(() -> new RuntimeException("Addon not found"));
                
                BookingAddon bookingAddon = new BookingAddon();
                bookingAddon.setBooking(savedBooking);
                bookingAddon.setAddon(addon);
                bookingAddon.setQuantity(addonSelection.getQuantity());
                bookingAddon.setPriceAtBooking(addon.getPrice());
                
                savedBooking.getAddons().add(bookingAddon);
            }
        }
        
        // Update package booking count
        tourPackage.setBookingCount(tourPackage.getBookingCount() + 1);
        packageRepository.save(tourPackage);
        
        return bookingRepository.save(savedBooking);
    }
    
    @Transactional
    public Booking cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }
        
        booking.setBookingStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
    
    private BigDecimal calculateTotalPrice(com.touragency.model.Package tourPackage, Integer numberOfAdults, 
                                          Integer numberOfChildren, List<AddonSelectionDto> selectedAddons) {
        // Base price * number of adults
        BigDecimal total = tourPackage.getBasePrice().multiply(BigDecimal.valueOf(numberOfAdults));
        
        // Add child prices (assuming children are half price)
        if (numberOfChildren > 0) {
            BigDecimal childPrice = tourPackage.getBasePrice().multiply(BigDecimal.valueOf(0.5));
            BigDecimal childTotal = childPrice.multiply(BigDecimal.valueOf(numberOfChildren));
            total = total.add(childTotal);
        }
        
        // Add addon prices
        if (selectedAddons != null && !selectedAddons.isEmpty()) {
            for (AddonSelectionDto addonSelection : selectedAddons) {
                Addon addon = addonRepository.findById(addonSelection.getAddonId())
                        .orElseThrow(() -> new RuntimeException("Addon not found"));
                
                BigDecimal addonTotal = addon.getPrice().multiply(BigDecimal.valueOf(addonSelection.getQuantity()));
                total = total.add(addonTotal);
            }
        }
        
        return total;
    }
}
