import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Package } from './package.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getWishlist(): Observable<Package[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Package[]>(`${this.apiUrl}/${userId}/wishlist`);
  }

  addToWishlist(packageId: number): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post<void>(`${this.apiUrl}/${userId}/wishlist/${packageId}`, {});
  }

  removeFromWishlist(packageId: number): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    return this.http.delete<void>(`${this.apiUrl}/${userId}/wishlist/${packageId}`);
  }

  isPackageInWishlist(packageId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<boolean>(`${this.apiUrl}/${userId}/wishlist/${packageId}`);
  }
  
  checkWishlistStatus(packageId: number): Observable<{inWishlist: boolean}> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<{inWishlist: boolean}>(`${this.apiUrl}/${userId}/wishlist/${packageId}`);
  }
}
