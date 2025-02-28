import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) { }

  /**
   * Validates a coupon code
   * @param code The coupon code to validate
   * @returns Observable with coupon details if valid
   */
  validateCoupon(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/validate/${code}`);
  }

  /**
   * Applies a coupon to a booking
   * @param bookingId The booking ID
   * @param couponCode The coupon code to apply
   * @returns Observable with updated booking details
   */
  applyCoupon(bookingId: number, couponCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, { bookingId, couponCode });
  }

  /**
   * Removes a coupon from a booking
   * @param bookingId The booking ID
   * @returns Observable with updated booking details
   */
  removeCoupon(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, { bookingId });
  }

  /**
   * Calculates the discount amount based on the coupon and order total
   * @param coupon The coupon object
   * @param orderTotal The total order amount
   * @returns The calculated discount amount
   */
  calculateDiscount(coupon: Coupon, orderTotal: number): number {
    if (!coupon || !coupon.isActive || orderTotal < coupon.minOrderValue) {
      return 0;
    }

    let discountAmount = 0;
    
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      
      // Apply maximum discount cap if set
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      // Fixed discount
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order total
    return Math.min(discountAmount, orderTotal);
  }
}
