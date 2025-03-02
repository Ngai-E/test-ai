import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  totalRevenue: number;
  revenueChart: {
    labels: string[];
    data: number[];
  };
  popularPackages: any[];
  recentBookings: any[];
  recentReviews: any[];
}

export interface AdminBooking {
  id: number;
  packageId: number;
  packageName: string;
  packageImage?: string;
  userId: number;
  userName: string;
  userEmail: string;
  date: Date;
  adults: number;
  children?: number;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
  specialRequirements?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`).pipe(
      catchError(this.handleError('getDashboardStats', {} as DashboardStats))
    );
  }

  // Package Management
  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/packages`).pipe(
      catchError(this.handleError('getPackages', []))
    );
  }

  createPackage(packageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/packages`, packageData).pipe(
      catchError(this.handleError('createPackage', {}))
    );
  }

  updatePackage(id: number, packageData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/packages/${id}`, packageData).pipe(
      catchError(this.handleError('updatePackage', {}))
    );
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/packages/${id}`).pipe(
      catchError(this.handleError<void>('deletePackage'))
    );
  }

  // Booking Management
  getBookings(): Observable<AdminBooking[]> {
    return this.http.get<AdminBooking[]>(`${this.apiUrl}/bookings`).pipe(
      catchError(this.handleError('getBookings', []))
    );
  }

  getBookingById(id: number): Observable<AdminBooking> {
    return this.http.get<AdminBooking>(`${this.apiUrl}/bookings/${id}`).pipe(
      catchError(this.handleError('getBookingById', {} as AdminBooking))
    );
  }

  updateBookingStatus(id: number, status: string): Observable<AdminBooking> {
    return this.http.patch<AdminBooking>(`${this.apiUrl}/bookings/${id}/status`, { status }).pipe(
      catchError(this.handleError('updateBookingStatus', {} as AdminBooking))
    );
  }

  updatePaymentStatus(id: number, paymentStatus: string): Observable<AdminBooking> {
    return this.http.patch<AdminBooking>(`${this.apiUrl}/bookings/${id}/payment`, { paymentStatus }).pipe(
      catchError(this.handleError('updatePaymentStatus', {} as AdminBooking))
    );
  }

  // Review Management
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews`).pipe(
      catchError(this.handleError('getAllReviews', []))
    );
  }

  approveReview(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}/approve`, {}).pipe(
      catchError(this.handleError('approveReview', {}))
    );
  }

  rejectReview(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}/reject`, {}).pipe(
      catchError(this.handleError('rejectReview', {}))
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`).pipe(
      catchError(this.handleError<void>('deleteReview'))
    );
  }

  // User Management
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError('getAllUsers', []))
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError('getUserById', {}))
    );
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}/role`, { role }).pipe(
      catchError(this.handleError('updateUserRole', {}))
    );
  }

  deactivateUser(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}/deactivate`, {}).pipe(
      catchError(this.handleError('deactivateUser', {}))
    );
  }

  activateUser(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}/activate`, {}).pipe(
      catchError(this.handleError('activateUser', {}))
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return new Observable<T>(observer => {
        if (result !== undefined) {
          observer.next(result as T);
        } else {
          observer.next();
        }
        observer.complete();
      });
    };
  }
}
