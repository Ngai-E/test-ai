import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Test authentication using interceptors
   * This will rely on the JWT interceptor to add the token
   */
  testAuthWithInterceptor(): Observable<any> {
    console.log('Testing auth with interceptor');
    return this.http.get(`${this.apiUrl}/test/auth`)
      .pipe(
        tap(
          response => console.log('Auth test success:', response),
          error => console.error('Auth test error:', error)
        )
      );
  }

  /**
   * Test authentication with explicit headers
   * This bypasses interceptors and adds the token directly
   */
  testAuthWithExplicitHeaders(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Testing auth with explicit headers, token:', token);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${this.apiUrl}/test/auth`, { headers })
      .pipe(
        tap(
          response => console.log('Auth test with explicit headers success:', response),
          error => console.error('Auth test with explicit headers error:', error)
        )
      );
  }

  /**
   * Test a public endpoint that doesn't require authentication
   */
  testPublicEndpoint(): Observable<any> {
    console.log('Testing public endpoint');
    return this.http.get(`${this.apiUrl}/public/test`)
      .pipe(
        tap(
          response => console.log('Public endpoint test success:', response),
          error => console.error('Public endpoint test error:', error)
        )
      );
  }

  /**
   * Get the current token from localStorage
   */
  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    return token;
  }
}
