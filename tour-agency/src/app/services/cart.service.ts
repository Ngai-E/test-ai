import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CartItemAddon {
  id: number;
  addonId: number;
  addonName: string;
  addonDescription: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: number;
  userId: number;
  packageId: number;
  packageName: string;
  packageImage: string;
  packageCountry: string;
  packageDuration: number;
  startDate: string;
  endDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  basePrice: number;
  addedAt: string;
  addons: CartItemAddon[];
}

export interface AddonSelectionDto {
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
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCart();
  }
  
  private loadCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.cartItemsSubject.next([]);
      return;
    }
    
    this.getCartItems().subscribe(
      items => this.cartItemsSubject.next(items),
      error => {
        console.error('Error loading cart:', error);
        if (error.status === 403 || error.status === 401) {
          this.cartItemsSubject.next([]);
        }
      }
    );
  }
  
  getCartItems(): Observable<CartItem[]> {
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }
    
    const userId = this.authService.getCurrentUserId();
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching cart items:', error);
        return of([]);
      })
    );
  }
  
  getCartTotal(): Observable<number> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/total`);
  }
  
  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.length)
    );
  }
  
  addToCart(
    packageId: number,
    startDate: string,
    endDate: string,
    numberOfAdults: number,
    numberOfChildren: number,
    addons: AddonSelectionDto[] = []
  ): Observable<CartItem> {
    const userId = this.authService.getCurrentUserId();
    
    return this.http.post<CartItem>(
      `${this.apiUrl}/user/${userId}/add?packageId=${packageId}&startDate=${startDate}&endDate=${endDate}&numberOfAdults=${numberOfAdults}&numberOfChildren=${numberOfChildren}`,
      addons
    ).pipe(
      tap(() => this.loadCart())
    );
  }
  
  removeCartItem(cartItemId: number): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    console.log(`CartService: Removing cart item ${cartItemId} for user ${userId}`);
    
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/remove/${cartItemId}`).pipe(
      tap(() => {
        console.log('CartService: Successfully removed cart item');
        // Update the cart items in the BehaviorSubject immediately
        const currentItems = this.cartItemsSubject.getValue();
        const updatedItems = currentItems.filter(item => item.id !== cartItemId);
        this.cartItemsSubject.next(updatedItems);
      }),
      catchError(error => {
        console.error('CartService: Error removing cart item:', error);
        
        // Handle specific error cases
        if (error.status === 404) {
          console.log('CartService: Item not found, removing from local state');
          // If the item doesn't exist on the server, we should still remove it from the local state
          const currentItems = this.cartItemsSubject.getValue();
          const updatedItems = currentItems.filter(item => item.id !== cartItemId);
          this.cartItemsSubject.next(updatedItems);
          
          // Return an empty observable to indicate "success" since the item is gone
          return of(undefined);
        }
        
        // Re-throw other errors so the component can handle them
        throw error;
      })
    );
  }
  
  clearCart(): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/clear`).pipe(
      tap(() => this.cartItemsSubject.next([]))
    );
  }
  
  updateCartItem(cartItemId: number, quantity: number): Observable<CartItem> {
    const userId = this.authService.getCurrentUserId();
    return this.http.put<CartItem>(
      `${this.apiUrl}/user/${userId}/item/${cartItemId}?quantity=${quantity}`,
      {}
    ).pipe(
      tap(() => this.loadCart())
    );
  }
  
  updateAddonQuantity(cartItemId: number, addonId: number, quantity: number): Observable<CartItem> {
    const userId = this.authService.getCurrentUserId();
    return this.http.put<CartItem>(
      `${this.apiUrl}/user/${userId}/item/${cartItemId}/addon/${addonId}?quantity=${quantity}`,
      {}
    ).pipe(
      tap(() => this.loadCart())
    );
  }
}
