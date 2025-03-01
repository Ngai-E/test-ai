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
import java.util.stream.Collectors;

@Service
public class PackageService {
    
    private final PackageRepository packageRepository;
    
    @Autowired
    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }
    
    public List<com.touragency.model.Package> getAllPackages() {
        return packageRepository.findAll();
    }
    
    public Optional<com.touragency.model.Package> getPackageById(Long id) {
        return packageRepository.findById(id);
    }
    
    @Transactional
    public com.touragency.model.Package createPackage(com.touragency.model.Package tourPackage) {
        // Set bidirectional relationships
        setRelationships(tourPackage);
        return packageRepository.save(tourPackage);
    }
    
    @Transactional
    public Optional<com.touragency.model.Package> updatePackage(Long id, com.touragency.model.Package tourPackage) {
        return packageRepository.findById(id)
            .map(existingPackage -> {
                tourPackage.setId(id);
                // Set bidirectional relationships
                setRelationships(tourPackage);
                return packageRepository.save(tourPackage);
            });
    }
    
    private void setRelationships(com.touragency.model.Package tourPackage) {
        // Set package types relationship
        if (tourPackage.getAddons() != null) {
            tourPackage.getAddons().forEach(addon -> addon.setTourPackage(tourPackage));
        }
        
        // Set itinerary days relationship
        if (tourPackage.getItinerary() != null) {
            tourPackage.getItinerary().forEach(day -> day.setTourPackage(tourPackage));
        }
    }
    
    public List<Package> searchPackages(String query) {
        return packageRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }
    
    public boolean deletePackage(Long id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Package> getUpcomingTours(int limit) {
        // In a real application, we would query the database for packages with future departure dates
        // and available slots
        
        // For now, we'll just return all packages
        List<Package> allPackages = packageRepository.findAll();
        
        // Sort by departure date (assuming packages have a departureDate field)
        // and filter to only include those with available slots
        // This is a placeholder implementation
        
        return allPackages.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    public List<Package> getFeaturedPackages() {
        // In a real application, we would query the database for packages marked as featured
        
        // For now, we'll just return all packages
        List<Package> allPackages = packageRepository.findAll();
        
        // In a real implementation, we would filter by a 'featured' flag
        // This is a placeholder implementation
        
        return allPackages.stream()
                .limit(5) // Return top 5 packages as featured
                .collect(Collectors.toList());
    }
}
