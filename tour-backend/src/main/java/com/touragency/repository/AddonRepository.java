package com.touragency.repository;

import com.touragency.model.Addon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddonRepository extends JpaRepository<Addon, Long> {
    List<Addon> findByTourPackageId(Long packageId);
    List<Addon> findByCategory(String category);
}
