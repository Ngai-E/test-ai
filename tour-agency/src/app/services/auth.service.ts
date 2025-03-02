import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User, PasswordChange } from '../models/user.model';

interface AuthResponse {
  id: number;
  phoneNumber: string;
  fullName: string;
  email: string;
  coinBalance: number;
  referralCode: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userUrl = `${environment.apiUrl}/users`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    // Check token expiration on service initialization
    if (storedUser) {
      this.autoLogout();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get the current user's ID
   * @returns The user ID
   */
  getCurrentUserId(): number {
    const currentUser = this.currentUserValue;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    if (currentUser.id === undefined) {
      throw new Error('User ID is undefined');
    }
    return currentUser.id;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  login(phoneNumber: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { phoneNumber, password })
      .pipe(
        tap(response => {
          // Store user details and jwt token in local storage to keep user logged in between page refreshes
          const user: User = {
            id: response.id,
            phoneNumber: response.phoneNumber,
            fullName: response.fullName,
            email: response.email,
            coinBalance: response.coinBalance,
            referralCode: response.referralCode,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token); // Store token separately for easier access
          this.currentUserSubject.next(user);
          this.autoLogout();
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { ...user, password })
      .pipe(
        tap(response => {
          // Store user details and jwt token in local storage
          const newUser: User = {
            id: response.id,
            phoneNumber: response.phoneNumber,
            fullName: response.fullName,
            email: response.email,
            coinBalance: response.coinBalance,
            referralCode: response.referralCode,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          localStorage.setItem('token', response.token); // Store token separately for easier access
          this.currentUserSubject.next(newUser);
          this.autoLogout();
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * Auto logout after token expiration (24 hours)
   */
  private autoLogout(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    // Set expiration to 24 hours
    const expirationDuration = 24 * 60 * 60 * 1000;
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Get the current user's profile
   */
  getUserProfile(): Observable<User> {
    const userId = this.getCurrentUserId();
    return this.http.get<User>(`${this.userUrl}/${userId}/profile`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          // Fallback to cached user data
          return of(this.currentUserValue as User);
        })
      );
  }

  /**
   * Update the user's profile information
   * @param userData Updated user data
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    const userId = this.getCurrentUserId();
    return this.http.put<User>(`${this.userUrl}/${userId}`, userData)
      .pipe(
        tap(updatedUser => {
          // Update local storage with new user data
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const mergedUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('currentUser', JSON.stringify(mergedUser));
            this.currentUserSubject.next(mergedUser);
          }
        }),
        catchError(error => {
          console.error('Error updating profile:', error);
          throw error;
        })
      );
  }

  /**
   * Change the user's password
   * @param passwordData Password change data
   */
  changePassword(passwordData: PasswordChange): Observable<any> {
    const userId = this.getCurrentUserId();
    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };
    
    return this.http.put<any>(`${this.userUrl}/${userId}`, payload)
      .pipe(
        catchError(error => {
          console.error('Error changing password:', error);
          throw error;
        })
      );
  }

  /**
   * Check if the current user has admin role
   * @returns boolean indicating if user is an admin
   */
  isAdmin(): boolean {
    const currentUser = this.currentUserValue;
    // In a real application, you would check the user's role from the token or user object
    // For now, we'll simulate this with a simple check
    if (!currentUser) {
      return false;
    }
    
    // Check if user has admin role - this would be based on your actual user model
    // For example: return currentUser.role === 'admin';
    
    // For development purposes, we'll return true to allow access to admin pages
    return true;
  }

  /**
   * Get user's referral information
   */
  getReferralInfo(): Observable<{ referralCode: string, referralCount: number, coinsEarned: number }> {
    // Extract referral info from the cached user data
    const user = this.currentUserValue;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return of({
      referralCode: user.referralCode || '',
      referralCount: 0, // This information is not available in the user profile
      coinsEarned: user.coinBalance || 0
    });
  }

  /**
   * Generate a coupon from user's coin balance
   * @param value The value of the coupon to generate
   */
  generateCoupon(value: number): Observable<any> {
    const userId = this.getCurrentUserId();
    return this.http.post<any>(`${this.userUrl}/${userId}/generate-coupon?value=${value}`, {});
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    // Get token directly from localStorage for consistency
    return localStorage.getItem('token');
  }
}
