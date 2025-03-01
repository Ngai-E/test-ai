package com.touragency.controller;

import com.touragency.dto.ContactRequest;
import com.touragency.dto.ContactResponse;
import com.touragency.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Contact form APIs")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Operation(summary = "Submit contact form", description = "Submits a contact form with user message")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contact form successfully submitted", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContactResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ContactResponse> submitContactForm(
            @Parameter(description = "Contact form details") @RequestBody ContactRequest request) {
        ContactResponse response = contactService.processContactForm(request);
        return ResponseEntity.ok(response);
    }
}
