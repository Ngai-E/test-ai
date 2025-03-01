package com.touragency.mapper;

import com.touragency.dto.CartItemDto;
import com.touragency.model.CartItem;
import com.touragency.model.CartItemAddon;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartItemMapper {

    public CartItemDto toDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setUserId(cartItem.getUser().getId());
        
        // Map package details
        dto.setPackageId(cartItem.getTourPackage().getId());
        dto.setPackageName(cartItem.getTourPackage().getName());
        dto.setPackageImage(cartItem.getTourPackage().getImage());
        dto.setPackageCountry(cartItem.getTourPackage().getCountry());
        dto.setPackageDuration(cartItem.getTourPackage().getDuration());
        
        dto.setStartDate(cartItem.getStartDate());
        dto.setEndDate(cartItem.getEndDate());
        dto.setNumberOfAdults(cartItem.getNumberOfAdults());
        dto.setNumberOfChildren(cartItem.getNumberOfChildren());
        dto.setBasePrice(cartItem.getBasePrice());
        dto.setAddedAt(cartItem.getAddedAt());
        
        // Map addons
        List<CartItemDto.CartItemAddonDto> addonDtos = cartItem.getAddons().stream()
                .map(this::toAddonDto)
                .collect(Collectors.toList());
        dto.setAddons(addonDtos);
        
        return dto;
    }
    
    public List<CartItemDto> toDtoList(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    private CartItemDto.CartItemAddonDto toAddonDto(CartItemAddon addon) {
        CartItemDto.CartItemAddonDto dto = new CartItemDto.CartItemAddonDto();
        dto.setId(addon.getId());
        dto.setAddonId(addon.getAddon().getId());
        dto.setAddonName(addon.getAddon().getName());
        dto.setAddonDescription(addon.getAddon().getDescription());
        dto.setQuantity(addon.getQuantity());
        dto.setPrice(addon.getPrice());
        return dto;
    }
}
