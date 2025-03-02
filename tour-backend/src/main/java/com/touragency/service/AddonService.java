package com.touragency.service;

import com.touragency.model.Addon;
import com.touragency.model.Package;
import com.touragency.repository.AddonRepository;
import com.touragency.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddonService {

    @Autowired
    private AddonRepository addonRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    public List<Addon> getPackageAddons(Long packageId) {
        return addonRepository.findByTourPackageId(packageId);
    }
    
    public List<Addon> getAddonsByCategory(String category) {
        return addonRepository.findByCategory(category);
    }
    
    public Addon getAddonById(Long addonId) {
        return addonRepository.findById(addonId)
                .orElseThrow(() -> new RuntimeException("Addon not found"));
    }
    
    @Transactional
    public Addon createAddon(Long packageId, Addon addon) {
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        addon.setTourPackage(tourPackage);
        return addonRepository.save(addon);
    }
    
    @Transactional
    public Addon updateAddon(Long addonId, Addon addonDetails) {
        Addon addon = addonRepository.findById(addonId)
                .orElseThrow(() -> new RuntimeException("Addon not found"));
        
        // Update addon fields
        addon.setName(addonDetails.getName());
        addon.setDescription(addonDetails.getDescription());
        addon.setDetailedDescription(addonDetails.getDetailedDescription());
        addon.setPrice(addonDetails.getPrice());
        addon.setImageUrl(addonDetails.getImageUrl());
        addon.setVideoUrl(addonDetails.getVideoUrl());
        addon.setCategory(addonDetails.getCategory());
        
        return addonRepository.save(addon);
    }
    
    @Transactional
    public void deleteAddon(Long addonId) {
        Addon addon = addonRepository.findById(addonId)
                .orElseThrow(() -> new RuntimeException("Addon not found"));
        
        addonRepository.delete(addon);
    }
}
