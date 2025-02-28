import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  id: number;
  user: any;
  tourPackage: any;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
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

  constructor(private http: HttpClient) { }

  getPackageReviews(packageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/package/${packageId}`);
  }

  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  createReview(userId: number, reviewRequest: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/user/${userId}`, reviewRequest);
  }

  deleteReview(reviewId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}/user/${userId}`);
  }
}
