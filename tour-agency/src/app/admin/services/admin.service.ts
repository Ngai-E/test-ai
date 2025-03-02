import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalBookings: number;
  bookingsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalPackages: number;
  totalReviews: number;
  averageRating: number;
  mostPopularPackage: any;
}

export interface AdminAddon {
  id: number;
  addon?: {
    id: number;
    name: string;
    description: string;
    detailedDescription?: string;
    price: number;
    category?: string;
  };
  quantity: number;
  priceAtBooking?: number;
}

export interface AdminBooking {
  id: number;
  packageId: number;
  packageName: string;
  packageImage?: string;
  packagePrice?: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
  startDate: string;
  endDate: string;
  travelDate?: string;
  duration?: number;
  adults: number;
  children?: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  amount: number;
  totalPrice?: number;
  status: string;
  bookingStatus?: string;
  paymentStatus: string;
  bookingReference?: string;
  createdAt?: string;
  updatedAt?: string;
  specialRequirements?: string;
  notes?: string;
  couponCode?: string;
  discountAmount?: number;
  addons?: AdminAddon[];
  tourPackage?: any;
}

export interface Addon {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  tourPackageId: number;
}

export interface ItineraryDay {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string;
  tourPackageId: number;
  activities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/statistics`).pipe(
      catchError(this.handleError('getDashboardStats', {} as DashboardStats))
    );
  }

  // Package Management
  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/packages`).pipe(
      catchError(this.handleError('getPackages', []))
    );
  }

  getPackageById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/packages/${id}`).pipe(
      catchError(this.handleError('getPackageById', {}))
    );
  }

  getPackage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/packages/${id}`).pipe(
      catchError(this.handleError('getPackage', null))
    );
  }

  createPackage(packageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/packages`, packageData).pipe(
      catchError(this.handleError('createPackage', {}))
    );
  }

  updatePackage(id: number, packageData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/packages/${id}`, packageData).pipe(
      catchError(this.handleError('updatePackage', {}))
    );
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/packages/${id}`).pipe(
      catchError(this.handleError<void>('deletePackage'))
    );
  }

  // Addon Management
  getAddonsByPackageId(packageId: number): Observable<Addon[]> {
    return this.http.get<Addon[]>(`${this.apiUrl}/packages/${packageId}/addons`).pipe(
      catchError(this.handleError('getAddonsByPackageId', []))
    );
  }

  createAddon(packageId: number, addonData: Partial<Addon>): Observable<Addon> {
    return this.http.post<Addon>(`${this.apiUrl}/packages/${packageId}/addons`, addonData).pipe(
      catchError(this.handleError('createAddon', {} as Addon))
    );
  }

  updateAddon(packageId: number, addonId: number, addonData: Partial<Addon>): Observable<Addon> {
    return this.http.put<Addon>(`${this.apiUrl}/addons/${addonId}`, addonData).pipe(
      catchError(this.handleError('updateAddon', {} as Addon))
    );
  }

  deleteAddon(packageId: number, addonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/addons/${addonId}`).pipe(
      catchError(this.handleError<void>('deleteAddon'))
    );
  }

  // Itinerary Management
  getItineraryByPackageId(packageId: number): Observable<ItineraryDay[]> {
    return this.http.get<ItineraryDay[]>(`${this.apiUrl}/packages/${packageId}/itinerary`).pipe(
      catchError(this.handleError('getItineraryByPackageId', []))
    );
  }

  createItineraryDay(packageId: number, itineraryData: Partial<ItineraryDay>): Observable<ItineraryDay> {
    return this.http.post<ItineraryDay>(`${this.apiUrl}/packages/${packageId}/itinerary`, itineraryData).pipe(
      catchError(this.handleError('createItineraryDay', {} as ItineraryDay))
    );
  }

  updateItineraryDay(packageId: number, dayId: number, itineraryData: Partial<ItineraryDay>): Observable<ItineraryDay> {
    return this.http.put<ItineraryDay>(`${this.apiUrl}/itinerary/${dayId}`, itineraryData).pipe(
      catchError(this.handleError('updateItineraryDay', {} as ItineraryDay))
    );
  }

  deleteItineraryDay(packageId: number, dayId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/itinerary/${dayId}`).pipe(
      catchError(this.handleError<void>('deleteItineraryDay'))
    );
  }

  // Booking Management
  getBookings(): Observable<AdminBooking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`).pipe(
      map(bookings => {
        // If we get empty data from the API, return mock data for testing
        if (!bookings || bookings.length === 0) {
          return this.getMockBookings();
        }
        return this.mapBookingsResponse(bookings);
      }),
      catchError(error => {
        console.error('Error fetching bookings:', error);
        // Return mock data on error for testing
        return of(this.getMockBookings());
      })
    );
  }

  getBookingById(id: number): Observable<AdminBooking> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${id}`).pipe(
      map(booking => this.mapBookingResponse(booking)),
      catchError(this.handleError('getBookingById', {} as AdminBooking))
    );
  }

  updateBookingStatus(id: number, status: string): Observable<AdminBooking> {
    return this.http.put<any>(`${this.apiUrl}/bookings/${id}/status`, { status }).pipe(
      map(booking => this.mapBookingResponse(booking)),
      catchError(this.handleError('updateBookingStatus', {} as AdminBooking))
    );
  }

  updateBooking(id: number, booking: Partial<AdminBooking>): Observable<AdminBooking> {
    return this.http.put<any>(`${this.apiUrl}/bookings/${id}`, booking).pipe(
      map(response => this.mapBookingResponse(response)),
      catchError(this.handleError('updateBooking', {} as AdminBooking))
    );
  }

  private mapBookingsResponse(bookings: any[]): AdminBooking[] {
    return bookings.map(booking => this.mapBookingResponse(booking));
  }

  private mapBookingResponse(booking: any): AdminBooking {
    // Calculate total amount if it's not provided directly
    let amount = booking.totalPrice || booking.amount;
    
    if (!amount && booking.tourPackage) {
      // Base calculation on package price
      amount = booking.tourPackage.basePrice || booking.tourPackage.price || 0;
      
      // Multiply by number of adults
      if (booking.numberOfAdults) {
        amount *= booking.numberOfAdults;
      }
      
      // Add children at half price if applicable
      if (booking.numberOfChildren) {
        amount += (booking.tourPackage.basePrice * 0.5 * booking.numberOfChildren);
      }
      
      // Subtract discount if applicable
      if (booking.discountAmount) {
        amount -= booking.discountAmount;
      }
      
      // Add addon prices if applicable
      if (booking.addons && booking.addons.length > 0) {
        booking.addons.forEach((addon: any) => {
          const addonPrice = addon.priceAtBooking || addon.addon?.price || 0;
          const quantity = addon.quantity || 1;
          amount += addonPrice * quantity;
        });
      }
    }
    
    return {
      id: booking.id,
      packageId: booking.tourPackage?.id || booking.packageId,
      packageName: booking.tourPackage?.name || booking.packageName,
      packageImage: booking.tourPackage?.image || booking.tourPackage?.imageUrl || booking.packageImage,
      packagePrice: booking.tourPackage?.basePrice || booking.tourPackage?.price || booking.packagePrice,
      userId: booking.user?.id || booking.userId,
      userName: booking.user?.name || booking.userName,
      userEmail: booking.user?.email || booking.userEmail,
      userPhone: booking.user?.phone || booking.userPhone,
      startDate: booking.startDate || booking.date,
      endDate: booking.endDate,
      travelDate: booking.travelDate,
      duration: booking.duration || (booking.tourPackage?.duration || 1),
      adults: booking.numberOfAdults || booking.adults || 0,
      children: booking.numberOfChildren || booking.children || 0,
      numberOfAdults: booking.numberOfAdults,
      numberOfChildren: booking.numberOfChildren,
      amount: amount,
      totalPrice: booking.totalPrice,
      status: booking.bookingStatus || booking.status,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      bookingReference: booking.bookingReference || `BK-${booking.id}`,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      specialRequirements: booking.specialRequirements,
      notes: booking.notes,
      couponCode: booking.couponCode,
      discountAmount: booking.discountAmount,
      addons: booking.addons || []
    };
  }

  private getMockBookings(): AdminBooking[] {
    return [
      {
        id: 1,
        packageId: 1,
        packageName: 'Swiss Alps Adventure',
        packageImage: 'assets/images/packages/swiss-alps.jpg',
        packagePrice: 1499.99,
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        userPhone: '+1234567890',
        startDate: '2025-03-02',
        endDate: '2025-03-09',
        travelDate: '2025-03-02',
        duration: 7,
        adults: 2,
        children: 1,
        numberOfAdults: 2,
        numberOfChildren: 1,
        amount: 3499.99,
        totalPrice: 3499.99,
        status: 'Pending',
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
        bookingReference: 'BK-1001',
        createdAt: '2025-02-15T10:30:00',
        notes: 'Special request for gluten-free meals',
        addons: [
          {
            id: 1,
            addon: {
              id: 1,
              name: 'Ski Equipment',
              description: 'Full ski equipment rental',
              price: 150
            },
            quantity: 2,
            priceAtBooking: 150
          }
        ]
      },
      {
        id: 2,
        packageId: 1,
        packageName: 'Swiss Alps Adventure',
        packageImage: 'assets/images/packages/swiss-alps.jpg',
        packagePrice: 1499.99,
        userId: 2,
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        userPhone: '+9876543210',
        startDate: '2025-03-02',
        endDate: '2025-03-09',
        travelDate: '2025-03-02',
        duration: 7,
        adults: 1,
        children: 0,
        numberOfAdults: 1,
        numberOfChildren: 0,
        amount: 1699.99,
        totalPrice: 1699.99,
        status: 'Pending',
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
        bookingReference: 'BK-1002',
        createdAt: '2025-02-16T14:45:00'
      }
    ];
  }

  // Review Management
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews`).pipe(
      catchError(this.handleError('getAllReviews', []))
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`).pipe(
      catchError(this.handleError<void>('deleteReview'))
    );
  }

  // User Management
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError('getAllUsers', []))
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError('getUserById', {}))
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData).pipe(
      catchError(this.handleError('updateUser', {}))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError<void>('deleteUser'))
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return new Observable<T>(observer => {
        observer.next(result as T);
        observer.complete();
      });
    };
  }
}
