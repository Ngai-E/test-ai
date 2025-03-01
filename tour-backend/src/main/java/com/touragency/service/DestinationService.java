package com.touragency.service;

import com.touragency.dto.DestinationResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    public List<DestinationResponse> getAllDestinations() {
        // In a real application, this would come from a database
        return getHardcodedDestinations();
    }
    
    public List<DestinationResponse> getPopularDestinations(int limit) {
        return getHardcodedDestinations().stream()
                .sorted(Comparator.comparing(DestinationResponse::getPopularity).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    public List<DestinationResponse> getDestinationsByRegion(String region) {
        return getHardcodedDestinations().stream()
                .filter(dest -> dest.getRegion().equalsIgnoreCase(region))
                .collect(Collectors.toList());
    }
    
    private List<DestinationResponse> getHardcodedDestinations() {
        return Arrays.asList(
            new DestinationResponse(1L, "Paris", 
                    "The City of Light, known for its stunning architecture, art museums, and romantic atmosphere.", 
                    "paris.jpg", "Europe", "France", 95, 4.7),
            new DestinationResponse(2L, "Bali", 
                    "A tropical paradise with beautiful beaches, lush rice terraces, and vibrant cultural experiences.", 
                    "bali.jpg", "Asia", "Indonesia", 90, 4.8),
            new DestinationResponse(3L, "New York City", 
                    "The Big Apple, a global center for art, culture, fashion, and finance.", 
                    "nyc.jpg", "North America", "USA", 88, 4.5),
            new DestinationResponse(4L, "Cape Town", 
                    "A stunning coastal city with Table Mountain as its backdrop, offering diverse cultural experiences.", 
                    "capetown.jpg", "Africa", "South Africa", 82, 4.6),
            new DestinationResponse(5L, "Tokyo", 
                    "A bustling metropolis that perfectly blends ultramodern and traditional aspects of Japanese culture.", 
                    "tokyo.jpg", "Asia", "Japan", 87, 4.7),
            new DestinationResponse(6L, "Rome", 
                    "The Eternal City, filled with ancient ruins, art, vibrant street life, and delicious cuisine.", 
                    "rome.jpg", "Europe", "Italy", 89, 4.6),
            new DestinationResponse(7L, "Sydney", 
                    "A vibrant city known for its iconic Opera House, beautiful harbor, and nearby beaches.", 
                    "sydney.jpg", "Oceania", "Australia", 84, 4.5),
            new DestinationResponse(8L, "Rio de Janeiro", 
                    "Famous for its Carnival, samba, beaches, and the iconic Christ the Redeemer statue.", 
                    "rio.jpg", "South America", "Brazil", 80, 4.4),
            new DestinationResponse(9L, "Marrakech", 
                    "A magical place known for its medina, vibrant souks, gardens, and palaces.", 
                    "marrakech.jpg", "Africa", "Morocco", 78, 4.3),
            new DestinationResponse(10L, "Santorini", 
                    "A stunning Greek island known for its white-washed buildings, blue domes, and spectacular sunsets.", 
                    "santorini.jpg", "Europe", "Greece", 86, 4.8)
        );
    }
}
