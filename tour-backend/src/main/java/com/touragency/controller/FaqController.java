package com.touragency.controller;

import com.touragency.dto.FaqResponse;
import com.touragency.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@Tag(name = "FAQ", description = "Frequently Asked Questions APIs")
public class FaqController {

    @Autowired
    private FaqService faqService;

    @Operation(summary = "Get all FAQs", description = "Retrieves all frequently asked questions")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved FAQs", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = FaqResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<FaqResponse>> getAllFaqs() {
        List<FaqResponse> faqs = faqService.getAllFaqs();
        return ResponseEntity.ok(faqs);
    }
    
    @Operation(summary = "Get FAQs by category", description = "Retrieves frequently asked questions by category")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved FAQs", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = FaqResponse.class)))
    })
    @GetMapping("/category")
    public ResponseEntity<List<FaqResponse>> getFaqsByCategory(
            @Parameter(description = "Category to filter by") @RequestParam String category) {
        List<FaqResponse> faqs = faqService.getFaqsByCategory(category);
        return ResponseEntity.ok(faqs);
    }
}
