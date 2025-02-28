import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, PasswordChange } from '../models/user.model';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    // Create a mock user
    const mockUser: User = {
      id: 1,
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      coins: 100,
      referralCode: 'JOHNDOE10',
      role: 'USER'
    };

    this.currentUserSubject = new BehaviorSubject<User | null>(mockUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'johndoe',
        email: email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        coins: 100
      }
    };

    return of(mockResponse).pipe(delay(800));
  }

  register(user: User, password: string): Observable<AuthResponse> {
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token',
      user: {
        ...user,
        id: 1,
        role: 'USER',
        coins: 0
      }
    };

    return of(mockResponse).pipe(delay(800));
  }

  logout(): void {
    // Update the current user subject with null
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  updateProfile(userId: number, userData: Partial<User>): Observable<User> {
    // Update the current user with the new data
    const currentUser = this.currentUserValue;
    const updatedUser = { ...currentUser, ...userData } as User;
    
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser).pipe(delay(800));
  }

  changePassword(userId: number, passwordData: PasswordChange): Observable<any> {
    return of({ success: true }).pipe(delay(800));
  }

  refreshToken(): Observable<{ token: string }> {
    return of({ token: 'new-mock-jwt-token' }).pipe(delay(800));
  }
}
