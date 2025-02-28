# Tour Agency Frontend Application

This is the frontend application for the Tour Agency platform, a comprehensive solution for managing and booking tour packages. The application is built using Angular and provides a user-friendly interface for customers to browse, select, and book tour packages.

## Features

- **User Authentication**: Register and login functionality with JWT authentication
- **Package Browsing**: View all available tour packages with filtering and sorting options
- **Package Details**: Detailed view of each package with images, descriptions, and pricing
- **Booking System**: Book tour packages with options for selecting dates, number of travelers, and add-ons
- **Wishlist**: Save favorite packages to a personal wishlist
- **User Profile**: View and manage user profile information
- **Booking Management**: View, manage, and cancel bookings
- **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile devices

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Angular CLI (v13.3.5)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tour-agency.git
   cd tour-agency
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment:
   - Open `src/environments/environment.ts` for development
   - Open `src/environments/environment.prod.ts` for production
   - Update the API URL to match your backend server

## Running the Application

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Production Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Project Structure

```
src/
├── app/
│   ├── components/         # UI components
│   │   ├── auth/           # Authentication components (login, register)
│   │   ├── booking/        # Booking related components
│   │   ├── common/         # Common UI components (navbar, footer, etc.)
│   │   ├── package/        # Package related components
│   │   └── user/           # User profile components
│   ├── models/             # Data models and interfaces
│   ├── services/           # API services and business logic
│   ├── guards/             # Route guards for authentication
│   ├── interceptors/       # HTTP interceptors (auth, error handling)
│   └── app.module.ts       # Main application module
├── assets/                 # Static assets (images, icons, etc.)
├── environments/           # Environment configuration
└── styles/                 # Global styles and theme
```

## Key Components

### Authentication

- **Login**: Allows users to log in with their credentials
- **Register**: Allows new users to create an account

### Package Management

- **Package List**: Displays all available packages with filtering options
- **Package Details**: Shows detailed information about a specific package
- **Package Search**: Allows users to search for packages by name, destination, etc.

### Booking System

- **Booking Form**: Form for creating a new booking
- **Booking Confirmation**: Displays booking confirmation details
- **Booking List**: Shows all bookings for the current user
- **Booking Details**: Displays detailed information about a specific booking

### User Profile

- **Profile View**: Displays user profile information
- **Profile Edit**: Allows users to update their profile information
- **Wishlist**: Shows packages saved to the user's wishlist

## API Integration

The frontend communicates with the backend API using Angular's HttpClient. All API calls are encapsulated in service classes:

- **AuthService**: Handles user authentication and registration
- **PackageService**: Manages tour package data
- **BookingService**: Handles booking creation and management
- **UserService**: Manages user profile data and wishlist

## Error Handling

The application includes comprehensive error handling:

- HTTP error interceptor to catch and process API errors
- User-friendly error messages displayed using Angular Material snackbars
- Form validation with clear error messages

## Styling

The application uses:

- Angular Material for UI components
- Custom SCSS for styling
- Responsive design principles for mobile compatibility

## Testing

- Run `ng test` to execute unit tests via Karma
- Run `ng e2e` to execute end-to-end tests

## Deployment

1. Build the production version:
   ```bash
   ng build --prod
   ```

2. Deploy the contents of the `dist/tour-agency` directory to your web server or hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Angular team for the amazing framework
- All contributors who have helped to improve this project
