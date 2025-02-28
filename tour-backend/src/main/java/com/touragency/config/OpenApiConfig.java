package com.touragency.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI tourAgencyOpenAPI() {
        // Create a schema for Package class to avoid conflicts with java.lang.Package
        Map<String, Schema> schemas = new HashMap<>();
        Schema packageSchema = new Schema<>()
                .name("TourPackage")
                .description("Tour Package model");

        return new OpenAPI()
                .info(new Info()
                        .title("Tour Agency API")
                        .description("RESTful API for Tour Agency Application")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Tour Agency Team")
                                .email("support@touragency.com")
                                .url("https://www.touragency.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token in the format: Bearer {token}")));
    }
}
