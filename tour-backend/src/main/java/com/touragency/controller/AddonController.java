package com.touragency.controller;

import com.touragency.model.Addon;
import com.touragency.service.AddonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addons")
@CrossOrigin(origins = "http://localhost:4200")
public class AddonController {

    @Autowired
    private AddonService addonService;
    
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<Addon>> getPackageAddons(@PathVariable Long packageId) {
        List<Addon> addons = addonService.getPackageAddons(packageId);
        return ResponseEntity.ok(addons);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Addon>> getAddonsByCategory(@PathVariable String category) {
        List<Addon> addons = addonService.getAddonsByCategory(category);
        return ResponseEntity.ok(addons);
    }
    
    @GetMapping("/{addonId}")
    public ResponseEntity<Addon> getAddonById(@PathVariable Long addonId) {
        Addon addon = addonService.getAddonById(addonId);
        return ResponseEntity.ok(addon);
    }
}
