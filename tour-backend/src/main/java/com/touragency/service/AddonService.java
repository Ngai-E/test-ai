package com.touragency.service;

import com.touragency.model.Addon;
import com.touragency.repository.AddonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddonService {

    @Autowired
    private AddonRepository addonRepository;
    
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
}
