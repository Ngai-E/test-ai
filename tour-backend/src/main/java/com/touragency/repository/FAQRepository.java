package com.touragency.repository;

import com.touragency.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    List<FAQ> findByActiveOrderByDisplayOrderAsc(boolean active);
    
    List<FAQ> findByCategoryAndActiveOrderByDisplayOrderAsc(String category, boolean active);
}
