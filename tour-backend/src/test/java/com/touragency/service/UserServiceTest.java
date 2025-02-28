package com.touragency.service;

import com.touragency.dto.LoginRequest;
import com.touragency.dto.RegisterRequest;
import com.touragency.dto.UserResponse;
import com.touragency.model.Package;
import com.touragency.model.User;
import com.touragency.repository.PackageRepository;
import com.touragency.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Package testPackage;
    private RegisterRequest testRegisterRequest;
    private LoginRequest testLoginRequest;

    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setPhoneNumber("1234567890");
        testUser.setPassword("encodedPassword");
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setCoinBalance(100);
        testUser.setReferralCode("TESTREF");
        testUser.setWishlist(new HashSet<>());

        // Set up test package
        testPackage = new Package();
        testPackage.setId(1L);
        testPackage.setName("Test Package");
        testPackage.setDescription("Test Description");

        // Set up test register request
        testRegisterRequest = new RegisterRequest();
        testRegisterRequest.setPhoneNumber("1234567890");
        testRegisterRequest.setPassword("password");
        testRegisterRequest.setFullName("Test User");
        testRegisterRequest.setEmail("test@example.com");

        // Set up test login request
        testLoginRequest = new LoginRequest();
        testLoginRequest.setPhoneNumber("1234567890");
        testLoginRequest.setPassword("password");
    }

    @Test
    void register_ShouldRegisterUserAndReturnUserResponse() {
        // Arrange
        when(userRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(anyString())).thenReturn("testToken");

        // Act
        UserResponse result = userService.register(testRegisterRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPhoneNumber()).isEqualTo("1234567890");
        assertThat(result.getToken()).isEqualTo("testToken");
        verify(userRepository, times(1)).existsByPhoneNumber(anyString());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtService, times(1)).generateToken(anyString());
    }

    @Test
    void register_WhenPhoneNumberAlreadyExists_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByPhoneNumber(anyString())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.register(testRegisterRequest);
        });
        
        assertThat(exception.getMessage()).isEqualTo("Phone number already registered");
        verify(userRepository, times(1)).existsByPhoneNumber(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldAuthenticateAndReturnUserResponse() {
        // Arrange
        when(userRepository.findByPhoneNumber(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateToken(anyString())).thenReturn("testToken");

        // Act
        UserResponse result = userService.login(testLoginRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPhoneNumber()).isEqualTo("1234567890");
        assertThat(result.getToken()).isEqualTo("testToken");
        verify(userRepository, times(1)).findByPhoneNumber(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(jwtService, times(1)).generateToken(anyString());
    }

    @Test
    void login_WithInvalidCredentials_ShouldThrowException() {
        // Arrange
        when(userRepository.findByPhoneNumber(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.login(testLoginRequest);
        });
        
        assertThat(exception.getMessage()).isEqualTo("Invalid credentials");
        verify(userRepository, times(1)).findByPhoneNumber(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void addToWishlist_ShouldAddPackageToUserWishlist() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(packageRepository.findById(1L)).thenReturn(Optional.of(testPackage));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.addToWishlist(1L, 1L);

        // Assert
        verify(userRepository, times(1)).findById(1L);
        verify(packageRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void removeFromWishlist_ShouldRemovePackageFromUserWishlist() {
        // Arrange
        testUser.getWishlist().add(testPackage);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.removeFromWishlist(1L, 1L);

        // Assert
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getWishlist_ShouldReturnUserWishlist() {
        // Arrange
        testUser.getWishlist().add(testPackage);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        Set<Package> result = userService.getWishlist(1L);

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void isPackageInWishlist_WhenPackageInWishlist_ShouldReturnTrue() {
        // Arrange
        testUser.getWishlist().add(testPackage);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.isPackageInWishlist(1L, 1L);

        // Assert
        assertThat(result).isTrue();
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void isPackageInWishlist_WhenPackageNotInWishlist_ShouldReturnFalse() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.isPackageInWishlist(1L, 1L);

        // Assert
        assertThat(result).isFalse();
        verify(userRepository, times(1)).findById(1L);
    }
}
