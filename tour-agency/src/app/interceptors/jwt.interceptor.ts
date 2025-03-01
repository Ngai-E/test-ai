import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header with jwt if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const token = localStorage.getItem('token'); // Get token directly from localStorage for consistency
    
    if (isApiUrl) {
      const headers: { [name: string]: string } = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      request = request.clone({
        setHeaders: headers
      });
      
      console.log('JWT Interceptor - Request URL:', request.url);
      console.log('JWT Interceptor - Headers:', request.headers);
    }

    return next.handle(request);
  }
}
