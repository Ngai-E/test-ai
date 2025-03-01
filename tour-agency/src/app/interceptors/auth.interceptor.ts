import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // This interceptor now only handles error responses
    // Token addition is handled by JwtInterceptor
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Auth Interceptor - Error status:', error.status);
        
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          this.toastService.showError('Your session has expired. Please log in again.');
          
          // Store the current URL to redirect back after login
          const returnUrl = this.router.url;
          this.router.navigate(['/login'], { queryParams: { returnUrl } });
        }
        else if (error.status === 403) {
          console.error('Forbidden error:', error);
          this.toastService.showError('You do not have permission to perform this action');
        }
        
        return throwError(() => error);
      })
    );
  }
}
