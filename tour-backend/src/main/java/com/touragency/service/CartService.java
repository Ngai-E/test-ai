package com.touragency.service;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.model.*;
import com.touragency.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Autowired
    private AddonRepository addonRepository;
    
    public List<CartItem> getUserCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }
    
    @Transactional
    public CartItem addToCart(Long userId, Long packageId, LocalDate startDate, LocalDate endDate, 
                             Integer numberOfAdults, Integer numberOfChildren, List<AddonSelectionDto> selectedAddons) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.touragency.model.Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setTourPackage(tourPackage);
        cartItem.setStartDate(startDate);
        cartItem.setEndDate(endDate);
        cartItem.setNumberOfAdults(numberOfAdults);
        cartItem.setNumberOfChildren(numberOfChildren);
        cartItem.setBasePrice(tourPackage.getBasePrice());
        
        CartItem savedCartItem = cartItemRepository.save(cartItem);
        
        // Add selected addons
        if (selectedAddons != null && !selectedAddons.isEmpty()) {
            for (AddonSelectionDto addonSelection : selectedAddons) {
                Addon addon = addonRepository.findById(addonSelection.getAddonId())
                        .orElseThrow(() -> new RuntimeException("Addon not found"));
                
                CartItemAddon cartItemAddon = new CartItemAddon();
                cartItemAddon.setCartItem(savedCartItem);
                cartItemAddon.setAddon(addon);
                cartItemAddon.setQuantity(addonSelection.getQuantity());
                cartItemAddon.setPrice(addon.getPrice());
                
                savedCartItem.getAddons().add(cartItemAddon);
            }
        }
        
        return cartItemRepository.save(savedCartItem);
    }
    
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to remove this cart item");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(cartItems);
    }
    
    public BigDecimal calculateCartTotal(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        BigDecimal total = BigDecimal.ZERO;
        
        for (CartItem item : cartItems) {
            // Base price * number of adults
            BigDecimal baseTotal = item.getBasePrice().multiply(BigDecimal.valueOf(item.getNumberOfAdults()));
            
            // Add child prices (assuming children are half price)
            if (item.getNumberOfChildren() > 0) {
                BigDecimal childPrice = item.getBasePrice().multiply(BigDecimal.valueOf(0.5));
                BigDecimal childTotal = childPrice.multiply(BigDecimal.valueOf(item.getNumberOfChildren()));
                baseTotal = baseTotal.add(childTotal);
            }
            
            // Add addon prices
            for (CartItemAddon addon : item.getAddons()) {
                BigDecimal addonTotal = addon.getPrice().multiply(BigDecimal.valueOf(addon.getQuantity()));
                baseTotal = baseTotal.add(addonTotal);
            }
            
            total = total.add(baseTotal);
        }
        
        return total;
    }
}
