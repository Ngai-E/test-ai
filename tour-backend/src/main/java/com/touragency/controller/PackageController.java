package com.touragency.controller;

import com.touragency.model.Package;
import com.touragency.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "*")
public class PackageController {
    
    private final PackageService packageService;
    
    @Autowired
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }
    
    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(@PathVariable Long id) {
        return packageService.getPackageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Package createPackage(@RequestBody Package tourPackage) {
        return packageService.createPackage(tourPackage);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Package> updatePackage(@PathVariable Long id, @RequestBody Package tourPackage) {
        return packageService.updatePackage(id, tourPackage)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        return packageService.deletePackage(id) 
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
