import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking, TourPackage, Addon, Coupon } from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class MockBookingService {
  private mockBookings: Booking[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData(): void {
    // Mock tour packages
    const packages: TourPackage[] = [
      {
        id: 1,
        name: 'Paris Getaway',
        description: 'Experience the romance of Paris with this 5-day tour package.',
        destination: 'Paris, France',
        price: 1200,
        image: 'assets/images/paris.jpg',
        duration: 5
      },
      {
        id: 2,
        name: 'Tokyo Adventure',
        description: 'Explore the vibrant city of Tokyo with this 7-day adventure package.',
        destination: 'Tokyo, Japan',
        price: 1800,
        image: 'assets/images/tokyo.jpg',
        duration: 7
      },
      {
        id: 3,
        name: 'Bali Paradise',
        description: 'Relax in the beautiful beaches of Bali with this 6-day package.',
        destination: 'Bali, Indonesia',
        price: 1500,
        image: 'assets/images/bali.jpg',
        duration: 6
      }
    ];

    // Mock addons
    const addons: Addon[] = [
      {
        id: 1,
        name: 'Airport Transfer',
        description: 'Round-trip airport transfer',
        price: 50,
        quantity: 1
      },
      {
        id: 2,
        name: 'Guided Tour',
        description: 'Full-day guided tour with local expert',
        price: 100,
        quantity: 2
      },
      {
        id: 3,
        name: 'Spa Package',
        description: 'Relaxing spa treatment',
        price: 80,
        quantity: 1
      }
    ];

    // Mock coupons
    const coupons: Coupon[] = [
      {
        id: 1,
        code: 'SUMMER2023',
        description: 'Summer discount',
        discountPercentage: 10,
        validUntil: '2023-09-30'
      }
    ];

    // Generate mock bookings
    this.mockBookings = [
      {
        id: 101,
        userId: 1,
        packageId: 1,
        package: packages[0],
        bookingDate: '2023-05-15',
        travelDate: '2023-07-10',
        status: 'CONFIRMED',
        totalAmount: 1200,
        discountAmount: 120,
        finalAmount: 1080,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        specialRequests: 'Non-smoking room preferred',
        addons: [addons[0]],
        coupon: coupons[0]
      },
      {
        id: 102,
        userId: 1,
        packageId: 2,
        package: packages[1],
        bookingDate: '2023-06-20',
        travelDate: '2023-08-15',
        status: 'PENDING',
        totalAmount: 1800,
        discountAmount: 0,
        finalAmount: 1800,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        addons: [addons[1], addons[2]]
      },
      {
        id: 103,
        userId: 1,
        packageId: 3,
        package: packages[2],
        bookingDate: '2023-04-10',
        travelDate: '2023-05-20',
        status: 'COMPLETED',
        totalAmount: 1500,
        discountAmount: 0,
        finalAmount: 1500,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
      },
      {
        id: 104,
        userId: 1,
        packageId: 1,
        package: packages[0],
        bookingDate: '2023-07-05',
        travelDate: '2023-09-10',
        status: 'CANCELLED',
        totalAmount: 1200,
        discountAmount: 0,
        finalAmount: 1200,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
      }
    ];
  }

  // Get all bookings for the current user
  getUserBookings(): Observable<Booking[]> {
    return of(this.mockBookings).pipe(delay(800));
  }

  // Get a specific booking by ID
  getBooking(id: number): Observable<Booking> {
    const booking = this.mockBookings.find(b => b.id === id);
    return of(booking as Booking).pipe(delay(800));
  }

  // Create a new booking
  createBooking(bookingData: any): Observable<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.floor(Math.random() * 1000) + 200,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    
    this.mockBookings.push(newBooking);
    return of(newBooking).pipe(delay(800));
  }

  // Cancel a booking
  cancelBooking(id: number): Observable<any> {
    const booking = this.mockBookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'CANCELLED';
    }
    return of({ success: true }).pipe(delay(800));
  }

  // Validate a coupon code
  validateCoupon(code: string): Observable<Coupon> {
    const coupon: Coupon = {
      id: 1,
      code: 'SUMMER2023',
      description: 'Summer discount',
      discountPercentage: 10,
      validUntil: '2023-09-30'
    };
    
    return of(coupon).pipe(delay(800));
  }
}
