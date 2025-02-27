package com.touragency.e2e;

import com.touragency.model.Package;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PackageE2ETest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    @Test
    void fullPackageLifecycle() {
        // Create a new package
        Package tourPackage = new Package();
        tourPackage.setName("E2E Test Package");
        tourPackage.setDescription("E2E Test Description");
        tourPackage.setCountry("E2E Test Country");

        // Create package and store its ID
        Integer packageId = given()
                .contentType(ContentType.JSON)
                .body(tourPackage)
                .when()
                .post("/packages")
                .then()
                .statusCode(201)
                .body("name", equalTo("E2E Test Package"))
                .extract()
                .jsonPath()
                .getInt("id");

        // Get the created package
        given()
                .when()
                .get("/packages/{id}", packageId)
                .then()
                .statusCode(200)
                .body("name", equalTo("E2E Test Package"))
                .body("description", equalTo("E2E Test Description"))
                .body("country", equalTo("E2E Test Country"));

        // Update the package
        tourPackage.setName("Updated E2E Package");
        given()
                .contentType(ContentType.JSON)
                .body(tourPackage)
                .when()
                .put("/packages/{id}", packageId)
                .then()
                .statusCode(200)
                .body("name", equalTo("Updated E2E Package"));

        // Verify the update
        given()
                .when()
                .get("/packages/{id}", packageId)
                .then()
                .statusCode(200)
                .body("name", equalTo("Updated E2E Package"));

        // Get all packages and verify the updated package is in the list
        given()
                .when()
                .get("/packages")
                .then()
                .statusCode(200)
                .body("$", hasSize(greaterThan(0)))
                .body("find { it.id == " + packageId + " }.name", equalTo("Updated E2E Package"));

        // Delete the package
        given()
                .when()
                .delete("/packages/{id}", packageId)
                .then()
                .statusCode(204);

        // Verify the package was deleted
        given()
                .when()
                .get("/packages/{id}", packageId)
                .then()
                .statusCode(404);
    }

    @Test
    void createInvalidPackage_ShouldReturn400() {
        Package invalidPackage = new Package();
        // Name is required but not set

        given()
                .contentType(ContentType.JSON)
                .body(invalidPackage)
                .when()
                .post("/packages")
                .then()
                .statusCode(400);
    }

    @Test
    void getPackages_ShouldReturnSuccessfully() {
        given()
                .when()
                .get("/packages")
                .then()
                .statusCode(200)
                .body("$", notNullValue());
    }
}
