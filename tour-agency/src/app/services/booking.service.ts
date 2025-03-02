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
  value: number;
  type: string;
  validFrom: string;
  validTo: string;
  isUsed: boolean;
  createdAt: string;
}

export interface AddonSelectionDto {
  addonId: number;
  quantity: number;
}

export interface BookingRequest {
  packageId: number;
  startDate: string;
  endDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  selectedAddons: AddonSelectionDto[];
  couponCode?: string;
}

export interface Booking {
  id: number;
  userId?: number;
  packageId?: number;
  package?: TourPackage;
  tourPackage?: TourPackage;
  startDate: string;
  endDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
  couponCode?: string;
  discountAmount?: number;
  addons?: Addon[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  getUserBookings(): Observable<Booking[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/user/${userId}`);
  }
  
  getBookingDetails(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${bookingId}`);
  }
  
  // Alias for getBookingDetails to maintain compatibility
  getBooking(id: number): Observable<Booking> {
    return this.getBookingDetails(id);
  }
  
  getUserBookingById(bookingId: number): Observable<Booking> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Booking>(`${this.apiUrl}/bookings/user/${userId}/booking/${bookingId}`);
  }
  
  createBooking(bookingData: BookingRequest): Observable<Booking> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post<Booking>(`${this.apiUrl}/bookings/user/${userId}`, bookingData);
  }
  
  cancelBooking(bookingId: number): Observable<Booking> {
    const userId = this.authService.getCurrentUserId();
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${bookingId}/user/${userId}/cancel`, {});
  }
  
  // Additional methods to maintain compatibility with existing components
  cancelBookingForUser(userId: number, bookingId: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${bookingId}/user/${userId}/cancel`, {});
  }
  
  getUserBookingsByStatus(status: string): Observable<Booking[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/user/${userId}/status/${status}`);
  }
  
  validateCoupon(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/bookings/coupons/${code}`);
  }
  
  getBookingsByPackage(packageId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/package/${packageId}`);
  }
}
