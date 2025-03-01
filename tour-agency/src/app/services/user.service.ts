import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    // Return the cached user data from AuthService
    return this.authService.getUserProfile();
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    // Update the cached user data in AuthService
    return this.authService.updateProfile(userData);
  }

  getUserCoins(): Observable<number> {
    const user = this.authService.currentUserValue;
    return of(user?.coinBalance || 0);
  }

  // According to the API spec, there is no specific endpoint for getting just the referral code
  // We'll need to get the user profile and extract the referral code
  getReferralCode(): Observable<string> {
    const user = this.authService.currentUserValue;
    return of(user?.referralCode || '');
  }

  generateCoupon(value: number): Observable<{ code: string, value: number, expiryDate: string }> {
    // Mock implementation since the endpoint doesn't exist
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Expires in 1 month
    
    return of({
      code: `TOUR-${randomCode}`,
      value: value,
      expiryDate: expiryDate.toISOString()
    });
  }

  getUserBookings(): Observable<any[]> {
    // Mock implementation since the endpoint doesn't exist
    return of([]);
  }

  getUserBookingsByStatus(status: string): Observable<any[]> {
    // Mock implementation since the endpoint doesn't exist
    return of([]);
  }
}
