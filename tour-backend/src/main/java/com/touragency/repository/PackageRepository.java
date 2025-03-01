package com.touragency.repository;

import com.touragency.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
