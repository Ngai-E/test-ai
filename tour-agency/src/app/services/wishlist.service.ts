import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Package } from './package.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getWishlist(userId: number): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl}/${userId}/wishlist`);
  }

  addToWishlist(userId: number, packageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/wishlist/${packageId}`, {});
  }

  removeFromWishlist(userId: number, packageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/wishlist/${packageId}`);
  }

  isPackageInWishlist(userId: number, packageId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${userId}/wishlist/${packageId}`);
  }
}
