package com.touragency.service;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.dto.BookingRequest;
import com.touragency.model.*;
import com.touragency.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private AddonRepository addonRepository;

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private com.touragency.model.Package testPackage;
    private Booking testBooking;
    private Addon testAddon;
    private Coupon testCoupon;
    private BookingRequest testBookingRequest;

    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setPhoneNumber("1234567890");
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");

        // Set up test package
        testPackage = new com.touragency.model.Package();
        testPackage.setId(1L);
        testPackage.setName("Test Package");
        testPackage.setDescription("Test Description");
        testPackage.setBasePrice(BigDecimal.valueOf(1000));
        testPackage.setBookingCount(10);

        // Set up test addon
        testAddon = new Addon();
        testAddon.setId(1L);
        testAddon.setName("Test Addon");
        testAddon.setDescription("Test Addon Description");
        testAddon.setPrice(BigDecimal.valueOf(100));

        // Set up test coupon
        testCoupon = new Coupon();
        testCoupon.setId(1L);
        testCoupon.setCode("TEST10");
        testCoupon.setType("PERCENTAGE");
        testCoupon.setValue(BigDecimal.valueOf(10));
        testCoupon.setIsUsed(false);

        // Set up test booking
        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setUser(testUser);
        testBooking.setTourPackage(testPackage);
        testBooking.setStartDate(LocalDate.now().plusDays(10));
        testBooking.setEndDate(LocalDate.now().plusDays(15));
        testBooking.setNumberOfAdults(2);
        testBooking.setNumberOfChildren(1);
        testBooking.setTotalPrice(BigDecimal.valueOf(2500));
        testBooking.setBookingStatus("BOOKED");
        testBooking.setPaymentStatus("PENDING");
        testBooking.setAddons(new ArrayList<>());

        // Set up test booking request
        testBookingRequest = new BookingRequest();
        testBookingRequest.setPackageId(1L);
        testBookingRequest.setStartDate(LocalDate.now().plusDays(10));
        testBookingRequest.setEndDate(LocalDate.now().plusDays(15));
        testBookingRequest.setNumberOfAdults(2);
        testBookingRequest.setNumberOfChildren(1);
        testBookingRequest.setSelectedAddons(new ArrayList<>());
    }

    @Test
    void getUserBookings_ShouldReturnUserBookings() {
        // Arrange
        when(bookingRepository.findByUserId(1L)).thenReturn(Arrays.asList(testBooking));

        // Act
        List<Booking> result = bookingService.getUserBookings(1L);

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        verify(bookingRepository, times(1)).findByUserId(1L);
    }

    @Test
    void getUserBookingsByStatus_ShouldReturnBookingsWithSpecifiedStatus() {
        // Arrange
        when(bookingRepository.findByUserIdAndBookingStatus(1L, "BOOKED")).thenReturn(Arrays.asList(testBooking));

        // Act
        List<Booking> result = bookingService.getUserBookingsByStatus(1L, "BOOKED");

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBookingStatus()).isEqualTo("BOOKED");
        verify(bookingRepository, times(1)).findByUserIdAndBookingStatus(1L, "BOOKED");
    }

    @Test
    void createBooking_ShouldCreateAndReturnBooking() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        Booking result = bookingService.createBooking(1L, testBookingRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUser().getId()).isEqualTo(1L);
        assertThat(result.getTourPackage().getId()).isEqualTo(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(packageRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
        verify(packageRepository, times(1)).save(any(com.touragency.model.Package.class));
    }

    @Test
    void createBooking_WithCoupon_ShouldApplyDiscount() {
        // Arrange
        testBookingRequest.setCouponCode("TEST10");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));
        when(couponRepository.findByCode("TEST10")).thenReturn(Optional.of(testCoupon));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        Booking result = bookingService.createBooking(1L, testBookingRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getCouponCode()).isEqualTo("TEST10");
        verify(couponRepository, times(1)).findByCode("TEST10");
        verify(couponRepository, times(1)).save(any(Coupon.class));
    }

    @Test
    void createBooking_WithAddons_ShouldAddAddonsToBooking() {
        // Arrange
        AddonSelectionDto addonSelection = new AddonSelectionDto();
        addonSelection.setAddonId(1L);
        addonSelection.setQuantity(2);
        testBookingRequest.setSelectedAddons(Arrays.asList(addonSelection));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));
        when(addonRepository.findById(1L)).thenReturn(Optional.of(testAddon));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        Booking result = bookingService.createBooking(1L, testBookingRequest);

        // Assert
        assertThat(result).isNotNull();
        verify(addonRepository, atLeastOnce()).findById(1L);
    }

    @Test
    void cancelBooking_ShouldCancelBooking() {
        // Arrange
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        Booking result = bookingService.cancelBooking(1L, 1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getBookingStatus()).isEqualTo("CANCELLED");
        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void cancelBooking_WhenUserNotAuthorized_ShouldThrowException() {
        // Arrange
        User differentUser = new User();
        differentUser.setId(2L);
        testBooking.setUser(differentUser);
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bookingService.cancelBooking(1L, 1L);
        });
        
        assertThat(exception.getMessage()).isEqualTo("Not authorized to cancel this booking");
        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, never()).save(any(Booking.class));
    }
}
