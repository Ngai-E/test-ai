package com.touragency.repository;

import com.touragency.model.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    
    List<ContactSubmission> findByEmailOrderByCreatedAtDesc(String email);
    
    List<ContactSubmission> findByStatusOrderByCreatedAtDesc(ContactSubmission.SubmissionStatus status);
}
