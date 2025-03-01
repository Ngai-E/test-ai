import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem, CartItemAddon } from '../../services/cart.service';
import { CouponService, Coupon } from '../../services/coupon.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { AddonTotalPipe } from '../../pipes/addon-total.pipe';
import { catchError, finalize } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  couponForm: FormGroup;
  bookingForm: FormGroup;
  loading = false;
  couponLoading = false;
  bookingLoading = false;
  errorMessage = '';
  successMessage = '';
  couponErrorMessage = '';
  couponSuccessMessage = '';
  appliedCoupon: Coupon | null = null;
  subtotal = 0;
  discount = 0;
  total = 0;
  
  isLoggedIn = false;
  wishlistItems: number[] = [];
  private subscriptions: Subscription[] = [];
  
  constructor(
    private cartService: CartService,
    private couponService: CouponService,
    private bookingService: BookingService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private addonTotalPipe: AddonTotalPipe
  ) {
    this.couponForm = this.fb.group({
      couponCode: ['', Validators.required]
    });
    
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.prefillUserInfo();
    
    // Subscribe to auth changes
    const authSub = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.loadWishlist();
      } else {
        this.wishlistItems = [];
      }
    });
    this.subscriptions.push(authSub);
    
    // Subscribe to cart changes
    const cartSub = this.cartService.cartItems$.subscribe(items => {
      console.log('Cart items updated from observable:', items);
      this.cartItems = items;
      this.calculateTotals();
    });
    this.subscriptions.push(cartSub);
  }
  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadWishlist(): void {
    if (!this.isLoggedIn) return;
    
    const wishlistSub = this.wishlistService.getWishlist().subscribe({
      next: (wishlistPackages: any[]) => {
        this.wishlistItems = wishlistPackages.map(pkg => pkg.id);
      },
      error: (error: any) => {
        console.error('Error loading wishlist:', error);
      }
    });
    this.subscriptions.push(wishlistSub);
  }

  isInWishlist(packageId: number): boolean {
    return this.wishlistItems.includes(packageId);
  }

  toggleWishlist(packageId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/cart' }
      });
      return;
    }

    if (this.isInWishlist(packageId)) {
      const removeSub = this.wishlistService.removeFromWishlist(packageId).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(id => id !== packageId);
          this.toastService.showSuccess('Removed from wishlist');
        },
        error: (error: any) => {
          console.error('Error removing from wishlist:', error);
          this.toastService.showError('Failed to remove from wishlist');
        }
      });
      this.subscriptions.push(removeSub);
    } else {
      const addSub = this.wishlistService.addToWishlist(packageId).subscribe({
        next: () => {
          this.wishlistItems.push(packageId);
          this.toastService.showSuccess('Added to wishlist');
        },
        error: (error: any) => {
          console.error('Error adding to wishlist:', error);
          this.toastService.showError('Failed to add to wishlist');
        }
      });
      this.subscriptions.push(addSub);
    }
  }

  get hasItems(): boolean {
    return this.cartItems && this.cartItems.length > 0;
  }

  loadCartItems(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.cartService.getCartItems()
      .pipe(
        catchError(error => {
          console.error('Error loading cart items:', error);
          this.errorMessage = 'Failed to load cart items. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.calculateTotals();
        })
      )
      .subscribe(items => {
        console.log('Cart items loaded:', items);
        this.cartItems = items;
      });
  }

  prefillUserInfo(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Extract first and last name from fullName
      const nameParts = currentUser.fullName ? currentUser.fullName.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      this.bookingForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || ''
      });
    }
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.numberOfAdults + change;
    if (newQuantity < 1) return;
    
    this.loading = true;
    this.cartService.updateCartItem(item.id, newQuantity)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to update quantity. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.calculateTotals();
        })
      )
      .subscribe(response => {
        if (response) {
          item.numberOfAdults = newQuantity;
        }
      });
  }

  updateAddonQuantity(item: CartItem, addon: CartItemAddon, change: number): void {
    const newQuantity = addon.quantity + change;
    if (newQuantity < 0) return;
    
    this.loading = true;
    this.cartService.updateAddonQuantity(item.id, addon.addonId, newQuantity)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to update addon quantity. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.calculateTotals();
        })
      )
      .subscribe(response => {
        if (response) {
          addon.quantity = newQuantity;
        }
      });
  }

  removeItem(itemId: number): void {
    this.loading = true;
    this.errorMessage = '';
    console.log('Removing cart item with ID:', itemId);
    console.log('Current user ID:', this.authService.getCurrentUserId());
    
    this.cartService.removeCartItem(itemId)
      .pipe(
        catchError(error => {
          console.error('Error removing cart item:', error);
          this.errorMessage = `Failed to remove item: ${error.error?.message || error.message || 'Unknown error'}`;
          this.toastService.showError(this.errorMessage);
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          console.log('Successfully removed cart item');
          // The cartItems array should be automatically updated via the subscription to cartItems$
          // but we'll also manually filter it just to be safe
          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          this.calculateTotals();
          this.toastService.showSuccess('Item removed from cart');
        },
        error: (error) => {
          console.error('Error in removeItem subscribe:', error);
        }
      });
  }

  applyCoupon(): void {
    if (this.couponForm.invalid) return;
    
    const couponCode = this.couponForm.value.couponCode;
    this.couponLoading = true;
    this.couponErrorMessage = '';
    this.couponSuccessMessage = '';
    
    this.couponService.validateCoupon(couponCode)
      .pipe(
        catchError(error => {
          this.couponErrorMessage = error.error?.message || 'Invalid coupon code. Please try again.';
          this.appliedCoupon = null;
          return of(null);
        }),
        finalize(() => {
          this.couponLoading = false;
          this.calculateTotals();
        })
      )
      .subscribe(coupon => {
        if (coupon) {
          this.appliedCoupon = coupon;
          this.couponSuccessMessage = `Coupon "${coupon.code}" applied successfully!`;
        }
      });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponForm.reset();
    this.couponSuccessMessage = '';
    this.couponErrorMessage = '';
    this.calculateTotals();
  }

  calculateTotals(): void {
    // Calculate subtotal
    this.subtotal = this.cartItems.reduce((total, item) => {
      const itemTotal = item.basePrice * item.numberOfAdults;
      const addonTotal = this.addonTotalPipe.transform(item.addons || []);
      return total + itemTotal + addonTotal;
    }, 0);
    
    // Apply discount if coupon is present
    if (this.appliedCoupon) {
      if (this.appliedCoupon.discountType === 'PERCENTAGE') {
        this.discount = (this.subtotal * this.appliedCoupon.discountValue) / 100;
        // Apply maximum discount cap if set
        if (this.appliedCoupon.maxDiscountAmount && this.discount > this.appliedCoupon.maxDiscountAmount) {
          this.discount = this.appliedCoupon.maxDiscountAmount;
        }
      } else {
        this.discount = this.appliedCoupon.discountValue;
      }
      
      // Ensure discount doesn't exceed subtotal
      this.discount = Math.min(this.discount, this.subtotal);
    } else {
      this.discount = 0;
    }
    
    // Calculate total
    this.total = this.subtotal - this.discount;
  }

  checkout(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    
    if (!this.hasItems) {
      this.errorMessage = 'Your cart is empty. Please add items before checkout.';
      return;
    }
    
    this.bookingLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const bookingData = {
      ...this.bookingForm.value,
      cartItems: this.cartItems.map(item => item.id),
      couponCode: this.appliedCoupon?.code || null,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total
    };
    
    this.bookingService.createBooking(bookingData)
      .pipe(
        catchError(error => {
          this.errorMessage = error.error?.message || 'Failed to create booking. Please try again.';
          return of(null);
        }),
        finalize(() => this.bookingLoading = false)
      )
      .subscribe(response => {
        if (response) {
          this.successMessage = 'Booking created successfully!';
          this.cartService.clearCart().subscribe(() => {
            this.cartItems = [];
            this.calculateTotals();
            setTimeout(() => {
              this.router.navigate(['/bookings', response.id]);
            }, 2000);
          });
        }
      });
  }
}
