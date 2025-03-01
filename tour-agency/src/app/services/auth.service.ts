import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
    return this.http.get<User>(`${this.userUrl}/${userId}`);
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
          // Update stored user data
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const newUserData = { ...currentUser, ...updatedUser };
            localStorage.setItem('currentUser', JSON.stringify(newUserData));
            this.currentUserSubject.next(newUserData);
          }
        })
      );
  }

  /**
   * Change the user's password
   * @param passwordData Password change data
   */
  changePassword(passwordData: PasswordChange): Observable<{ message: string }> {
    const userId = this.getCurrentUserId();
    return this.http.post<{ message: string }>(`${this.userUrl}/${userId}/change-password`, passwordData);
  }

  /**
   * Get user's referral information
   */
  getReferralInfo(): Observable<{ referralCode: string, referralCount: number, coinsEarned: number }> {
    const userId = this.getCurrentUserId();
    // Based on the API spec, we don't have a specific endpoint for referrals
    // We'll use the user profile endpoint and extract the relevant information
    return this.getUserProfile().pipe(
      map(user => ({
        referralCode: user.referralCode || '',
        referralCount: 0, // This information is not available in the user profile
        coinsEarned: user.coinBalance || 0
      }))
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
