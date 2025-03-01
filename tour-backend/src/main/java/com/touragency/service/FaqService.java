package com.touragency.service;

import com.touragency.dto.FaqResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FaqService {

    public List<FaqResponse> getAllFaqs() {
        // In a real application, this would come from a database
        return getHardcodedFaqs();
    }
    
    public List<FaqResponse> getFaqsByCategory(String category) {
        return getHardcodedFaqs().stream()
                .filter(faq -> faq.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }
    
    private List<FaqResponse> getHardcodedFaqs() {
        return Arrays.asList(
            new FaqResponse(1L, "How do I book a tour?", 
                    "You can book a tour by creating an account, selecting your desired package, and completing the booking process.", 
                    "booking"),
            new FaqResponse(2L, "What payment methods do you accept?", 
                    "We accept credit cards, PayPal, bank transfers, and mobile money payments.", 
                    "payment"),
            new FaqResponse(3L, "Can I cancel my booking?", 
                    "Yes, you can cancel your booking up to 48 hours before the scheduled departure. Cancellation fees may apply.", 
                    "booking"),
            new FaqResponse(4L, "Do you offer group discounts?", 
                    "Yes, we offer discounts for groups of 5 or more people. Please contact our customer service for more information.", 
                    "payment"),
            new FaqResponse(5L, "What should I pack for my tour?", 
                    "Packing requirements depend on your destination. We will provide a detailed packing list after your booking is confirmed.", 
                    "preparation"),
            new FaqResponse(6L, "Are meals included in the tour price?", 
                    "Most tours include breakfast. Some packages include additional meals as specified in the tour details.", 
                    "services"),
            new FaqResponse(7L, "Do I need travel insurance?", 
                    "We strongly recommend purchasing travel insurance for all our tours. We can assist you in finding suitable coverage.", 
                    "preparation"),
            new FaqResponse(8L, "How can I use my referral code?", 
                    "Share your referral code with friends. When they register and make a booking, both you and your friend will receive bonus coins.", 
                    "rewards")
        );
    }
}
