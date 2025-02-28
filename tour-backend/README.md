# Tour Agency Backend API

This is the backend API for the Tour Agency platform, providing RESTful endpoints for managing tour packages, bookings, users, and more. The application is built using Spring Boot and provides a robust foundation for the Tour Agency frontend application.

## Features

- **RESTful API**: Well-designed REST API with proper HTTP methods and status codes
- **User Authentication**: Secure authentication using JWT tokens
- **Package Management**: Create, read, update, and delete tour packages
- **Booking System**: Manage bookings with support for add-ons and coupons
- **User Management**: User registration, profile management, and wishlist functionality
- **Swagger Documentation**: Interactive API documentation with Swagger UI
- **Database Integration**: MySQL database with JPA/Hibernate ORM
- **Testing**: Comprehensive unit and integration tests

## Prerequisites

- Java 17 or later
- Maven 3.6.0 or later
- MySQL 8.0 or later

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tour-backend.git
   cd tour-backend
   ```

2. Configure the database:
   - Create a MySQL database named `tour_agency`
   - Update `src/main/resources/application.properties` with your database credentials

3. Build the project:
   ```bash
   mvn clean install
   ```

## Running the Application

### Development Mode

```bash
mvn spring-boot:run
```

The application will start on port 8081 by default. You can access the API at `http://localhost:8081/api`.

### Production Mode

1. Build the JAR file:
   ```bash
   mvn clean package
   ```

2. Run the JAR file:
   ```bash
   java -jar target/tour-backend-0.0.1-SNAPSHOT.jar
   ```

## API Documentation

The API documentation is available through Swagger UI. After starting the application, you can access it at:

```
http://localhost:8081/swagger-ui.html
```

This provides an interactive interface to explore and test all available endpoints.

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── touragency/
│   │           ├── config/         # Configuration classes
│   │           ├── controller/     # REST controllers
│   │           ├── dto/            # Data Transfer Objects
│   │           ├── exception/      # Exception handling
│   │           ├── model/          # Entity models
│   │           ├── repository/     # Data repositories
│   │           ├── security/       # Security configuration
│   │           ├── service/        # Business logic services
│   │           └── TourApplication.java  # Main application class
│   └── resources/
│       ├── application.properties  # Application configuration
│       ├── db/
│       │   └── changelog/          # Liquibase database migrations
│       └── static/                 # Static resources
└── test/
    └── java/
        └── com/
            └── touragency/
                ├── controller/     # Controller tests
                ├── repository/     # Repository tests
                └── service/        # Service tests
```

## Key Components

### Controllers

- **AuthController**: Handles user authentication and registration
- **PackageController**: Manages tour package operations
- **BookingController**: Handles booking creation and management
- **UserController**: Manages user profile and wishlist operations

### Services

- **UserService**: User management and authentication logic
- **PackageService**: Tour package business logic
- **BookingService**: Booking creation and management logic
- **JwtService**: JWT token generation and validation

### Models

- **User**: Represents a user in the system
- **Package**: Represents a tour package
- **Booking**: Represents a booking made by a user
- **Addon**: Represents additional services that can be added to a booking
- **Coupon**: Represents discount coupons

## Security

The application uses Spring Security with JWT for authentication. The security flow is as follows:

1. User registers or logs in through the `/api/auth` endpoints
2. Server validates credentials and returns a JWT token
3. Client includes the JWT token in the Authorization header for subsequent requests
4. Server validates the token and grants access to protected resources

## Testing

The project includes comprehensive tests for repositories, services, and controllers.

### Running Tests

```bash
mvn test
```

### Test Coverage

```bash
mvn verify
```

This will generate a test coverage report in the `target/site/jacoco` directory.

## Database

The application uses MySQL as the primary database. Database migrations are managed with Liquibase, ensuring consistent schema evolution.

## Error Handling

The application includes a global exception handler that translates exceptions into appropriate HTTP responses with meaningful error messages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spring Boot team for the excellent framework
- All contributors who have helped to improve this project
