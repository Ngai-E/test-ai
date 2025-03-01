package com.touragency.service;

import com.touragency.dto.AddonSelectionDto;
import com.touragency.model.*;
import com.touragency.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Autowired
    private AddonRepository addonRepository;
    
    public List<CartItem> getUserCart(Long userId) {
        logger.info("Getting cart items for user: {}", userId);
        return cartItemRepository.findByUserId(userId);
    }
    
    @Transactional
    public CartItem addToCart(Long userId, Long packageId, LocalDate startDate, LocalDate endDate, 
                             Integer numberOfAdults, Integer numberOfChildren, List<AddonSelectionDto> selectedAddons) {
        logger.info("Adding to cart for user: {}, package: {}", userId, packageId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });
        
        com.touragency.model.Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> {
                    logger.error("Package not found with ID: {}", packageId);
                    return new RuntimeException("Package not found");
                });
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setTourPackage(tourPackage);
        cartItem.setStartDate(startDate);
        cartItem.setEndDate(endDate);
        cartItem.setNumberOfAdults(numberOfAdults);
        cartItem.setNumberOfChildren(numberOfChildren);
        cartItem.setBasePrice(tourPackage.getBasePrice());
        
        CartItem savedCartItem = cartItemRepository.save(cartItem);
        logger.info("Created cart item with ID: {}", savedCartItem.getId());
        
        // Add selected addons
        if (selectedAddons != null && !selectedAddons.isEmpty()) {
            for (AddonSelectionDto addonSelection : selectedAddons) {
                Addon addon = addonRepository.findById(addonSelection.getAddonId())
                        .orElseThrow(() -> {
                            logger.error("Addon not found with ID: {}", addonSelection.getAddonId());
                            return new RuntimeException("Addon not found");
                        });
                
                CartItemAddon cartItemAddon = new CartItemAddon();
                cartItemAddon.setCartItem(savedCartItem);
                cartItemAddon.setAddon(addon);
                cartItemAddon.setQuantity(addonSelection.getQuantity());
                cartItemAddon.setPrice(addon.getPrice());
                
                savedCartItem.getAddons().add(cartItemAddon);
                logger.info("Added addon ID: {} to cart item ID: {}", addon.getId(), savedCartItem.getId());
            }
        }
        
        return cartItemRepository.save(savedCartItem);
    }
    
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        logger.info("Removing cart item ID: {} for user ID: {}", cartItemId, userId);
        
        // First check if the cart item exists
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (!cartItemOpt.isPresent()) {
            logger.error("Cart item not found with ID: {}", cartItemId);
            throw new RuntimeException("Cart item not found");
        }
        
        CartItem cartItem = cartItemOpt.get();
        
        // Check if the cart item belongs to the user
        if (cartItem.getUser() == null) {
            logger.error("Cart item ID: {} has no associated user", cartItemId);
            throw new RuntimeException("Cart item has no associated user");
        }
        
        if (!cartItem.getUser().getId().equals(userId)) {
            logger.error("User ID: {} not authorized to remove cart item ID: {} (belongs to user ID: {})", 
                    userId, cartItemId, cartItem.getUser().getId());
            throw new RuntimeException("Not authorized to remove this cart item");
        }
        
        logger.info("Deleting cart item ID: {}", cartItemId);
        cartItemRepository.delete(cartItem);
        logger.info("Successfully deleted cart item ID: {}", cartItemId);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        logger.info("Clearing cart for user ID: {}", userId);
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        logger.info("Found {} cart items to delete", cartItems.size());
        cartItemRepository.deleteAll(cartItems);
        logger.info("Successfully cleared cart for user ID: {}", userId);
    }
    
    public BigDecimal calculateCartTotal(Long userId) {
        logger.info("Calculating cart total for user ID: {}", userId);
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
        
        logger.info("Cart total for user ID: {} is {}", userId, total);
        return total;
    }
    
    @Transactional
    public CartItem updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        logger.info("Updating quantity for cart item ID: {} to {} for user ID: {}", cartItemId, quantity, userId);
        
        if (quantity < 1) {
            logger.error("Invalid quantity: {}, must be at least 1", quantity);
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (!cartItemOpt.isPresent()) {
            logger.error("Cart item not found with ID: {}", cartItemId);
            throw new RuntimeException("Cart item not found");
        }
        
        CartItem cartItem = cartItemOpt.get();
        
        if (cartItem.getUser() == null) {
            logger.error("Cart item ID: {} has no associated user", cartItemId);
            throw new RuntimeException("Cart item has no associated user");
        }
        
        if (!cartItem.getUser().getId().equals(userId)) {
            logger.error("User ID: {} not authorized to update cart item ID: {} (belongs to user ID: {})", 
                    userId, cartItemId, cartItem.getUser().getId());
            throw new RuntimeException("Not authorized to update this cart item");
        }
        
        logger.info("Updating cart item ID: {} quantity from {} to {}", 
                cartItemId, cartItem.getNumberOfAdults(), quantity);
        cartItem.setNumberOfAdults(quantity);
        
        return cartItemRepository.save(cartItem);
    }
    
    @Transactional
    public CartItem updateAddonQuantity(Long userId, Long cartItemId, Long addonId, Integer quantity) {
        logger.info("Updating addon ID: {} quantity to {} for cart item ID: {} for user ID: {}", 
                addonId, quantity, cartItemId, userId);
        
        if (quantity < 0) {
            logger.error("Invalid quantity: {}, must be at least 0", quantity);
            throw new IllegalArgumentException("Quantity must be at least 0");
        }
        
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (!cartItemOpt.isPresent()) {
            logger.error("Cart item not found with ID: {}", cartItemId);
            throw new RuntimeException("Cart item not found");
        }
        
        CartItem cartItem = cartItemOpt.get();
        
        if (cartItem.getUser() == null) {
            logger.error("Cart item ID: {} has no associated user", cartItemId);
            throw new RuntimeException("Cart item has no associated user");
        }
        
        if (!cartItem.getUser().getId().equals(userId)) {
            logger.error("User ID: {} not authorized to update cart item ID: {} (belongs to user ID: {})", 
                    userId, cartItemId, cartItem.getUser().getId());
            throw new RuntimeException("Not authorized to update this cart item");
        }
        
        CartItemAddon addonToUpdate = null;
        for (CartItemAddon addon : cartItem.getAddons()) {
            if (addon.getAddon().getId().equals(addonId)) {
                addonToUpdate = addon;
                break;
            }
        }
        
        if (addonToUpdate == null) {
            logger.error("Addon ID: {} not found in cart item ID: {}", addonId, cartItemId);
            throw new RuntimeException("Addon not found in cart item");
        }
        
        logger.info("Updating addon ID: {} quantity from {} to {}", 
                addonId, addonToUpdate.getQuantity(), quantity);
        
        if (quantity == 0) {
            // Remove the addon if quantity is 0
            logger.info("Removing addon ID: {} from cart item ID: {} as quantity is 0", addonId, cartItemId);
            cartItem.getAddons().remove(addonToUpdate);
        } else {
            addonToUpdate.setQuantity(quantity);
        }
        
        return cartItemRepository.save(cartItem);
    }
}
