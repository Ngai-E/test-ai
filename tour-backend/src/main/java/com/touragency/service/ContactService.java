package com.touragency.service;

import com.touragency.dto.ContactRequest;
import com.touragency.dto.ContactResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class ContactService {

    public ContactResponse processContactForm(ContactRequest request) {
        // Validate request
        if (request.getName() == null || request.getName().trim().isEmpty() ||
            request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return new ContactResponse(false, "Please fill in all required fields", null);
        }
        
        // In a real application, you would save this to a database
        // and potentially send an email notification
        
        // Generate a reference number
        String referenceNumber = generateReferenceNumber();
        
        return new ContactResponse(true, 
                "Thank you for contacting us. We will get back to you shortly.", 
                referenceNumber);
    }
    
    private String generateReferenceNumber() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        return "CONTACT-" + timestamp + "-" + uuid;
    }
}
