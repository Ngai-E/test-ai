package com.touragency.repository;

import com.touragency.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    
    List<Destination> findByFeaturedOrderByNameAsc(boolean featured);
    
    List<Destination> findByRegionOrderByNameAsc(String region);
    
    List<Destination> findByCountryOrderByNameAsc(String country);
}
