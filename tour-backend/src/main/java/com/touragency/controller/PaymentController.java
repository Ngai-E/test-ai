package com.touragency.controller;

import com.touragency.dto.PaymentMethodResponse;
import com.touragency.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment", description = "Payment management APIs")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "Get all payment methods", description = "Retrieves all available payment methods")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved payment methods", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PaymentMethodResponse.class)))
    })
    @GetMapping("/methods")
    public ResponseEntity<List<PaymentMethodResponse>> getAllPaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentService.getAllPaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }
}
