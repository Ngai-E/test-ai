import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Get all bookings for the current user
  getUserBookings(): Observable<Booking[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get a specific booking by ID
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // Get a booking by ID for a specific user
  getBookingById(userId: number, bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/user/${userId}/booking/${bookingId}`);
  }

  // Get user bookings filtered by status
  getUserBookingsByStatus(userId: number, status: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }

  // Create a new booking
  createBooking(bookingData: any): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  // Cancel a booking
  cancelBooking(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Cancel a booking for a specific user
  cancelBookingForUser(userId: number, bookingId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/${userId}/booking/${bookingId}/cancel`, {});
  }

  // Validate a coupon code
  validateCoupon(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/coupons/${code}`);
  }
}
