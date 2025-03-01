package com.touragency.controller;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.dto.CartItemDto;
import com.touragency.mapper.CartItemMapper;
import com.touragency.model.CartItem;
import com.touragency.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;
    
    @Autowired
    private CartItemMapper cartItemMapper;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDto>> getUserCart(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getUserCart(userId);
        List<CartItemDto> cartItemDtos = cartItemMapper.toDtoList(cartItems);
        return ResponseEntity.ok(cartItemDtos);
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
        
        CartItem cartItem = cartService.addToCart(userId, packageId, startDate, endDate, 
                numberOfAdults, numberOfChildren, selectedAddons);
        CartItemDto cartItemDto = cartItemMapper.toDto(cartItem);
        return ResponseEntity.ok(cartItemDto);
    }
    
    @DeleteMapping("/user/{userId}/remove/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long cartItemId) {
        cartService.removeFromCart(userId, cartItemId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/user/{userId}/total")
    public ResponseEntity<BigDecimal> getCartTotal(@PathVariable Long userId) {
        BigDecimal total = cartService.calculateCartTotal(userId);
        return ResponseEntity.ok(total);
    }
}
