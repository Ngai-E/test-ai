package com.touragency.controller;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.dto.CartItemDto;
import com.touragency.mapper.CartItemMapper;
import com.touragency.model.CartItem;
import com.touragency.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;
    
    @Autowired
    private CartItemMapper cartItemMapper;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDto>> getUserCart(@PathVariable Long userId) {
        try {
            List<CartItem> cartItems = cartService.getUserCart(userId);
            List<CartItemDto> cartItemDtos = cartItemMapper.toDtoList(cartItems);
            return ResponseEntity.ok(cartItemDtos);
        } catch (Exception e) {
            logger.error("Error getting cart for user {}: {}", userId, e.getMessage());
            throw e;
        }
    }
    
    @PostMapping("/user/{userId}/add")
    public ResponseEntity<CartItemDto> addToCart(
            @PathVariable Long userId,
            @RequestParam Long packageId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Integer numberOfAdults,
            @RequestParam Integer numberOfChildren,
            @RequestBody(required = false) List<AddonSelectionDto> selectedAddons) {
        
        try {
            CartItem cartItem = cartService.addToCart(userId, packageId, startDate, endDate, 
                    numberOfAdults, numberOfChildren, selectedAddons);
            CartItemDto cartItemDto = cartItemMapper.toDto(cartItem);
            return ResponseEntity.ok(cartItemDto);
        } catch (Exception e) {
            logger.error("Error adding to cart for user {}: {}", userId, e.getMessage());
            throw e;
        }
    }
    
    @DeleteMapping("/user/{userId}/remove/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long cartItemId) {
        logger.info("Removing cart item {} for user {}", cartItemId, userId);
        try {
            cartService.removeFromCart(userId, cartItemId);
            logger.info("Successfully removed cart item {} for user {}", cartItemId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error removing cart item {} for user {}: {}", cartItemId, userId, e.getMessage());
            if (e.getMessage().contains("Cart item not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } else {
                throw e;
            }
        }
    }
    
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error clearing cart for user {}: {}", userId, e.getMessage());
            throw e;
        }
    }
    
    @GetMapping("/user/{userId}/total")
    public ResponseEntity<BigDecimal> getCartTotal(@PathVariable Long userId) {
        try {
            BigDecimal total = cartService.calculateCartTotal(userId);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            logger.error("Error getting cart total for user {}: {}", userId, e.getMessage());
            throw e;
        }
    }
    
    @PutMapping("/user/{userId}/item/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItemQuantity(
            @PathVariable Long userId, 
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        logger.info("Updating quantity for cart item {} to {} for user {}", cartItemId, quantity, userId);
        try {
            CartItem updatedItem = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
            CartItemDto cartItemDto = cartItemMapper.toDto(updatedItem);
            logger.info("Successfully updated cart item {} quantity to {}", cartItemId, quantity);
            return ResponseEntity.ok(cartItemDto);
        } catch (Exception e) {
            logger.error("Error updating cart item {} quantity for user {}: {}", cartItemId, userId, e.getMessage());
            if (e.getMessage().contains("Cart item not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } else {
                throw e;
            }
        }
    }
    
    @PutMapping("/user/{userId}/item/{cartItemId}/addon/{addonId}")
    public ResponseEntity<CartItemDto> updateAddonQuantity(
            @PathVariable Long userId, 
            @PathVariable Long cartItemId,
            @PathVariable Long addonId,
            @RequestParam Integer quantity) {
        logger.info("Updating addon {} quantity to {} for cart item {} for user {}", addonId, quantity, cartItemId, userId);
        try {
            CartItem updatedItem = cartService.updateAddonQuantity(userId, cartItemId, addonId, quantity);
            CartItemDto cartItemDto = cartItemMapper.toDto(updatedItem);
            logger.info("Successfully updated addon {} quantity to {} for cart item {}", addonId, quantity, cartItemId);
            return ResponseEntity.ok(cartItemDto);
        } catch (Exception e) {
            logger.error("Error updating addon {} quantity for cart item {} for user {}: {}", 
                    addonId, cartItemId, userId, e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } else {
                throw e;
            }
        }
    }
}
