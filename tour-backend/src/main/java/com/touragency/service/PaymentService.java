package com.touragency.service;

import com.touragency.dto.PaymentMethodResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PaymentService {

    public List<PaymentMethodResponse> getAllPaymentMethods() {
        // For now, return a hardcoded list of payment methods
        // In a real application, this would come from a database
        return Arrays.asList(
            new PaymentMethodResponse(1L, "Credit Card", "Pay with Visa, Mastercard, or American Express", "credit-card-icon", true),
            new PaymentMethodResponse(2L, "PayPal", "Pay with your PayPal account", "paypal-icon", true),
            new PaymentMethodResponse(3L, "Bank Transfer", "Pay directly from your bank account", "bank-transfer-icon", true),
            new PaymentMethodResponse(4L, "Mobile Money", "Pay using mobile money services", "mobile-money-icon", true)
        );
    }
}
