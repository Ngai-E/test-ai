import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  package: any;
  quantity: number;
  addons: any[];
}

export interface AddonSelection {
  addonId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadCart();
  }
  
  private loadCart(): void {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, use empty cart
      this.cartItemsSubject.next([]);
      return;
    }
    
    this.getCartItems().subscribe(
      items => this.cartItemsSubject.next(items),
      error => {
        console.error('Error loading cart:', error);
        // If unauthorized, use empty cart
        if (error.status === 403 || error.status === 401) {
          this.cartItemsSubject.next([]);
        }
      }
    );
  }
  
  getCartItems(): Observable<CartItem[]> {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, return empty array
      return of([]);
    }
    
    return this.http.get<CartItem[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching cart items:', error);
        return of([]);
      })
    );
  }
  
  // Get cart item count
  getCartItemCount(): Observable<number> {
    return this.getCartItems().pipe(
      map(items => {
        return items.length;
      })
    );
  }
  
  addToCart(
    userId: number,
    packageId: number,
    startDate: string,
    endDate: string,
    numberOfAdults: number,
    numberOfChildren: number,
    addons: any[] = []
  ): Observable<any> {
    const payload = {
      userId,
      packageId,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren,
      addons
    };
    
    return this.http.post<any>(`${this.apiUrl}`, payload).pipe(
      tap(() => this.loadCart())
    );
  }
  
  updateCartItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }
  
  updateAddonQuantity(itemId: number, addonId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${itemId}/addons/${addonId}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }
  
  removeCartItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => this.loadCart())
    );
  }
  
  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`).pipe(
      tap(() => this.cartItemsSubject.next([]))
    );
  }
}
