import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CouponService, Coupon } from '../../services/coupon.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { AddonTotalPipe } from '../../pipes/addon-total.pipe';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
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
  
  constructor(
    private cartService: CartService,
    private couponService: CouponService,
    private bookingService: BookingService,
    private authService: AuthService,
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
  }

  loadCartItems(): void {
    this.loading = true;
    this.cartService.getCartItems()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load cart items. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.calculateTotals();
        })
      )
      .subscribe(items => {
        this.cartItems = items;
      });
  }

  prefillUserInfo(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.bookingForm.patchValue({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
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
          item.quantity = newQuantity;
        }
      });
  }

  updateAddonQuantity(item: any, addon: any, change: number): void {
    const newQuantity = addon.quantity + change;
    if (newQuantity < 0) return;
    
    this.loading = true;
    this.cartService.updateAddonQuantity(item.id, addon.id, newQuantity)
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
    this.cartService.removeCartItem(itemId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to remove item. Please try again.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          this.calculateTotals();
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
      const itemTotal = item.package.price * item.quantity;
      const addonTotal = this.addonTotalPipe.transform(item.addons || []);
      return total + itemTotal + addonTotal;
    }, 0);
    
    // Calculate discount if coupon is applied
    this.discount = this.appliedCoupon ? 
      this.couponService.calculateDiscount(this.appliedCoupon, this.subtotal) : 0;
    
    // Calculate total
    this.total = this.subtotal - this.discount;
  }

  checkout(): void {
    if (this.bookingForm.invalid) return;
    
    this.bookingLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const bookingData = {
      ...this.bookingForm.value,
      couponId: this.appliedCoupon?.id
    };
    
    this.bookingService.createBooking(bookingData)
      .pipe(
        catchError(error => {
          this.errorMessage = error.error?.message || 'Failed to create booking. Please try again.';
          return of(null);
        }),
        finalize(() => this.bookingLoading = false)
      )
      .subscribe(booking => {
        if (booking) {
          this.successMessage = 'Booking created successfully!';
          this.cartService.clearCart().subscribe();
          setTimeout(() => {
            this.router.navigate(['/bookings', booking.id]);
          }, 1500);
        }
      });
  }

  get hasItems(): boolean {
    return this.cartItems.length > 0;
  }
}
