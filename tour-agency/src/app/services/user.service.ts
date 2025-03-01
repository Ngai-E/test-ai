import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

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
    const userId = this.authService.getCurrentUserId();
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    const userId = this.authService.getCurrentUserId();
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData);
  }

  getUserCoins(): Observable<number> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<number>(`${this.apiUrl}/${userId}/coins`);
  }

  // According to the API spec, there is no specific endpoint for getting just the referral code
  // We'll need to get the user profile and extract the referral code
  getReferralCode(): Observable<string> {
    return this.getUserProfile().pipe(
      map((user: User) => user.referralCode || '')
    );
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
