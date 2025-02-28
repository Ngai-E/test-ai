package com.touragency.controller;

import com.touragency.model.Package;
import com.touragency.service.PackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "*")
@Tag(name = "Package Management", description = "APIs for managing tour packages")
public class PackageController {
    
    private final PackageService packageService;
    
    @Autowired
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }
    
    @Operation(summary = "Get all packages", description = "Retrieves a list of all available tour packages")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of packages", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Package.class))))
    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }
    
    @Operation(summary = "Get package by ID", description = "Retrieves a specific tour package by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the package", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class))),
        @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(
            @Parameter(description = "ID of the package to retrieve") @PathVariable Long id) {
        return packageService.getPackageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Create a new package", description = "Creates a new tour package")
    @ApiResponse(responseCode = "201", description = "Package successfully created", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)))
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Package createPackage(
            @Parameter(description = "Package object to be created", required = true, 
                    schema = @Schema(implementation = Package.class)) 
            @RequestBody Package tourPackage) {
        return packageService.createPackage(tourPackage);
    }
    
    @Operation(summary = "Create a sample package", description = "Creates a sample tour package for testing")
    @ApiResponse(responseCode = "201", description = "Sample package successfully created", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)))
    @PostMapping("/sample")
    @ResponseStatus(HttpStatus.CREATED)
    public Package createSamplePackage() {
        Package samplePackage = new Package();
        samplePackage.setName("Sample Tour Package");
        samplePackage.setDescription("This is a sample tour package created for testing purposes");
        samplePackage.setCountry("Sample Country");
        samplePackage.setImage("https://example.com/sample-image.jpg");
        samplePackage.setOverview("Sample overview of the tour package");
        samplePackage.setDuration(7);
        samplePackage.setGroupSize("2-10 people");
        samplePackage.setTransportation("Private transportation");
        samplePackage.setAccommodation("4-star hotels");
        samplePackage.setMeals("Breakfast included");
        samplePackage.setBestTimeToVisit("All year round");
        samplePackage.setBasePrice(new BigDecimal("999.99"));
        
        List<String> highlights = new ArrayList<>();
        highlights.add("Sample highlight 1");
        highlights.add("Sample highlight 2");
        samplePackage.setHighlights(highlights);
        
        List<String> included = new ArrayList<>();
        included.add("Accommodation");
        included.add("Transportation");
        samplePackage.setIncluded(included);
        
        List<String> excluded = new ArrayList<>();
        excluded.add("Personal expenses");
        excluded.add("Travel insurance");
        samplePackage.setExcluded(excluded);
        
        return packageService.createPackage(samplePackage);
    }
    
    @Operation(summary = "Update a package", description = "Updates an existing tour package by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Package successfully updated", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class))),
        @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Package> updatePackage(
            @Parameter(description = "ID of the package to update") @PathVariable Long id,
            @Parameter(description = "Updated package object", required = true, 
                    schema = @Schema(implementation = Package.class)) 
            @RequestBody Package tourPackage) {
        return packageService.updatePackage(id, tourPackage)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Delete a package", description = "Deletes a tour package by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Package successfully deleted", content = @Content),
        @ApiResponse(responseCode = "404", description = "Package not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(
            @Parameter(description = "ID of the package to delete") @PathVariable Long id) {
        return packageService.deletePackage(id) 
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
