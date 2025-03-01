import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, PasswordChange } from '../models/user.model';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: User;
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
          // Store user details and token in local storage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
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
          // Store user details and token in local storage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
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
    return this.http.get<User>(`${this.userUrl}/profile`);
  }

  /**
   * Update the user's profile information
   * @param userData Updated user data
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/profile`, userData)
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
    return this.http.post<{ message: string }>(`${this.userUrl}/change-password`, passwordData);
  }

  /**
   * Get user's referral information
   */
  getReferralInfo(): Observable<{ referralCode: string, referralCount: number, coinsEarned: number }> {
    return this.http.get<{ referralCode: string, referralCount: number, coinsEarned: number }>(`${this.userUrl}/referrals`);
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
