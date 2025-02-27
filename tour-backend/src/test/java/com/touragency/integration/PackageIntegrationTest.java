package com.touragency.integration;

import com.touragency.model.Package;
import com.touragency.repository.PackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class PackageIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0.28")
            .withDatabaseName("tour_agency_test")
            .withUsername("test")
            .withPassword("test");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PackageRepository packageRepository;

    private String baseUrl;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/packages";
        packageRepository.deleteAll();
    }

    @Test
    void createPackage_ShouldReturnCreatedPackage() {
        // Arrange
        Package tourPackage = new Package();
        tourPackage.setName("Test Package");
        tourPackage.setDescription("Test Description");
        tourPackage.setCountry("Test Country");
        tourPackage.setHighlights(Arrays.asList("Highlight 1", "Highlight 2"));

        // Act
        ResponseEntity<Package> response = restTemplate.postForEntity(baseUrl, tourPackage, Package.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Test Package");
        assertThat(response.getBody().getId()).isNotNull();
    }

    @Test
    void getPackage_WhenExists_ShouldReturnPackage() {
        // Arrange
        Package tourPackage = new Package();
        tourPackage.setName("Test Package");
        tourPackage.setDescription("Test Description");
        Package savedPackage = packageRepository.save(tourPackage);

        // Act
        ResponseEntity<Package> response = restTemplate.getForEntity(
                baseUrl + "/" + savedPackage.getId(), Package.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Test Package");
    }

    @Test
    void getPackage_WhenNotExists_ShouldReturn404() {
        // Act
        ResponseEntity<Package> response = restTemplate.getForEntity(
                baseUrl + "/999", Package.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void updatePackage_WhenExists_ShouldReturnUpdatedPackage() {
        // Arrange
        Package tourPackage = new Package();
        tourPackage.setName("Original Name");
        Package savedPackage = packageRepository.save(tourPackage);

        Package updatedPackage = new Package();
        updatedPackage.setName("Updated Name");

        // Act
        ResponseEntity<Package> response = restTemplate.exchange(
                baseUrl + "/" + savedPackage.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(updatedPackage),
                Package.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Updated Name");
    }

    @Test
    void deletePackage_WhenExists_ShouldReturn204() {
        // Arrange
        Package tourPackage = new Package();
        tourPackage.setName("To Delete");
        Package savedPackage = packageRepository.save(tourPackage);

        // Act
        ResponseEntity<Void> response = restTemplate.exchange(
                baseUrl + "/" + savedPackage.getId(),
                HttpMethod.DELETE,
                null,
                Void.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(packageRepository.findById(savedPackage.getId())).isEmpty();
    }
}
