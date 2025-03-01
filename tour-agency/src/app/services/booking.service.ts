import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Addon {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  addon?: any;
  priceAtBooking?: number;
}

export interface TourPackage {
  id: number;
  name: string;
  description: string;
  destination: string;
  price: number;
  image: string;
  duration: number;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
}

export interface Booking {
  id: number;
  userId: number;
  packageId: number;
  package: TourPackage;
  tourPackage?: TourPackage;
  bookingDate: string;
  travelDate: string;
  startDate?: string;
  endDate?: string;
  status: string;
  bookingStatus?: string;
  paymentStatus?: string;
  totalAmount: number;
  packagePrice?: number;
  addonsTotalPrice?: number;
  totalPrice?: number;
  discountAmount: number;
  finalAmount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  bookingReference?: string;
  specialRequests?: string;
  addons?: Addon[];
  coupon?: Coupon;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  getUserBookings(): Observable<Booking[]> {
    // Mock implementation since the endpoint doesn't exist
    return of([]);
  }
  
  getBookingDetails(bookingId: number): Observable<Booking> {
    // Mock implementation with all required properties
    const mockPackage: TourPackage = {
      id: 1,
      name: 'Mock Tour Package',
      description: 'A beautiful tour package for testing',
      destination: 'Test Destination',
      price: 1000,
      image: 'assets/images/package1.jpg',
      duration: 7
    };
    
    return of({
      id: bookingId,
      packageId: 1,
      package: mockPackage,
      userId: this.authService.getCurrentUserId(),
      bookingDate: new Date().toISOString(),
      travelDate: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'paid',
      totalAmount: 1200,
      discountAmount: 0,
      finalAmount: 1200,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      numberOfAdults: 2,
      numberOfChildren: 1,
      bookingReference: `BOOK-${bookingId}`,
      addons: [],
      createdAt: new Date().toISOString()
    });
  }
  
  // Alias for getBookingDetails to maintain compatibility
  getBooking(id: number): Observable<Booking> {
    return this.getBookingDetails(id);
  }
  
  createBooking(bookingData: any): Observable<Booking> {
    // Mock implementation since the endpoint doesn't exist
    return of({
      id: Math.floor(Math.random() * 1000),
      ...bookingData,
      userId: this.authService.getCurrentUserId(),
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: new Date().toISOString()
    });
  }
  
  cancelBooking(bookingId: number): Observable<any> {
    // Mock implementation since the endpoint doesn't exist
    return of({ message: 'Booking cancelled successfully' });
  }
  
  // Additional methods to maintain compatibility with existing components
  cancelBookingForUser(userId: number, bookingId: number): Observable<any> {
    return this.cancelBooking(bookingId);
  }
  
  getUserBookingsByStatus(status: string): Observable<Booking[]> {
    // Mock implementation
    return of([]);
  }
  
  validateCoupon(code: string): Observable<Coupon> {
    // Mock implementation
    return of({
      id: 1,
      code: code,
      description: 'Discount coupon',
      discountPercentage: 10,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
    });
  }
}
