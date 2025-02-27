package com.touragency.service;

import com.touragency.model.ItineraryDay;
import com.touragency.model.Package;
import com.touragency.model.PackageType;
import com.touragency.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PackageService {
    
    private final PackageRepository packageRepository;
    
    @Autowired
    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }
    
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }
    
    public Optional<Package> getPackageById(Long id) {
        return packageRepository.findById(id);
    }
    
    @Transactional
    public Package createPackage(Package tourPackage) {
        // Set bidirectional relationships
        setRelationships(tourPackage);
        return packageRepository.save(tourPackage);
    }
    
    @Transactional
    public Optional<Package> updatePackage(Long id, Package tourPackage) {
        return packageRepository.findById(id)
            .map(existingPackage -> {
                tourPackage.setId(id);
                // Set bidirectional relationships
                setRelationships(tourPackage);
                return packageRepository.save(tourPackage);
            });
    }
    
    private void setRelationships(Package tourPackage) {
        // Set package types relationship
        if (tourPackage.getPackageTypes() != null) {
            tourPackage.getPackageTypes().forEach(packageType -> packageType.setTourPackage(tourPackage));
        }
        
        // Set itinerary days relationship
        if (tourPackage.getItinerary() != null) {
            tourPackage.getItinerary().forEach(day -> day.setTourPackage(tourPackage));
        }
    }
    
    public boolean deletePackage(Long id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
