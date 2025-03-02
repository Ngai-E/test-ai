package com.touragency.service;

import com.touragency.model.ItineraryDay;
import com.touragency.model.Package;
import com.touragency.repository.ItineraryDayRepository;
import com.touragency.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItineraryService {

    @Autowired
    private ItineraryDayRepository itineraryDayRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    public List<ItineraryDay> getPackageItinerary(Long packageId) {
        return itineraryDayRepository.findByTourPackageIdOrderByDayNumber(packageId);
    }
    
    public ItineraryDay getItineraryDayById(Long dayId) {
        return itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Itinerary day not found"));
    }
    
    @Transactional
    public ItineraryDay createItineraryDay(Long packageId, ItineraryDay itineraryDay) {
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        itineraryDay.setTourPackage(tourPackage);
        return itineraryDayRepository.save(itineraryDay);
    }
    
    @Transactional
    public ItineraryDay updateItineraryDay(Long dayId, ItineraryDay dayDetails) {
        ItineraryDay day = itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Itinerary day not found"));
        
        // Update day fields
        day.setDayNumber(dayDetails.getDayNumber());
        day.setTitle(dayDetails.getTitle());
        day.setDescription(dayDetails.getDescription());
        day.setAccommodation(dayDetails.getAccommodation());
        day.setMeals(dayDetails.getMeals());
        day.setActivities(dayDetails.getActivities());
        
        return itineraryDayRepository.save(day);
    }
    
    @Transactional
    public void deleteItineraryDay(Long dayId) {
        ItineraryDay day = itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Itinerary day not found"));
        
        itineraryDayRepository.delete(day);
    }
}
