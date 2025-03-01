import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  packageId: number;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewRequest {
  packageId: number;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getPackageReviews(packageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/package/${packageId}`);
  }

  getUserReviews(): Observable<Review[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  submitReview(reviewData: ReviewRequest): Observable<Review> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post<Review>(`${this.apiUrl}/user/${userId}`, reviewData);
  }

  deleteReview(reviewId: number): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}/user/${userId}`);
  }
  
  // According to the API spec, there is no specific endpoint for checking if a user has reviewed a package
  // We'll need to get all user reviews and check if any match the package ID
  hasUserReviewed(packageId: number): Observable<boolean> {
    return this.getUserReviews().pipe(
      map((reviews: Review[]) => {
        return reviews.some(review => review.packageId === packageId);
      })
    );
  }
}
