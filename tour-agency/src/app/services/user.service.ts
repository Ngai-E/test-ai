import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface User {
  id: number;
  phoneNumber: string;
  fullName: string;
  email: string;
  coinBalance: number;
  referralCode: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }

  getUserCoins(): Observable<number> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<number>(`${this.apiUrl}/${userId}/coins`);
  }

  getReferralCode(): Observable<string> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<string>(`${this.apiUrl}/${userId}/referral-code`);
  }

  generateCoupon(value: number): Observable<{ code: string, value: number, expiryDate: string }> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post<{ code: string, value: number, expiryDate: string }>(
      `${this.apiUrl}/${userId}/generate-coupon?value=${value}`, 
      {}
    );
  }

  getUserBookings(): Observable<any[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/bookings`);
  }

  getUserBookingsByStatus(status: string): Observable<any[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/bookings/status/${status}`);
  }
}
