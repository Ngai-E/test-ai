package com.touragency.controller;

import com.touragency.dto.DestinationResponse;
import com.touragency.service.DestinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@Tag(name = "Destination", description = "Destination management APIs")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @Operation(summary = "Get all destinations", description = "Retrieves all available destinations")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved destinations", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DestinationResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getAllDestinations() {
        List<DestinationResponse> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }
    
    @Operation(summary = "Get popular destinations", description = "Retrieves popular destinations based on bookings")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved popular destinations", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DestinationResponse.class)))
    })
    @GetMapping("/popular")
    public ResponseEntity<List<DestinationResponse>> getPopularDestinations(
            @Parameter(description = "Maximum number of destinations to return") @RequestParam(required = false, defaultValue = "5") int limit) {
        List<DestinationResponse> destinations = destinationService.getPopularDestinations(limit);
        return ResponseEntity.ok(destinations);
    }
    
    @Operation(summary = "Get destinations by region", description = "Retrieves destinations in a specific region")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved destinations", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DestinationResponse.class)))
    })
    @GetMapping("/region/{region}")
    public ResponseEntity<List<DestinationResponse>> getDestinationsByRegion(
            @Parameter(description = "Region to filter by") @PathVariable String region) {
        List<DestinationResponse> destinations = destinationService.getDestinationsByRegion(region);
        return ResponseEntity.ok(destinations);
    }
}
