import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookingId = Number(params.get('id'));
      if (bookingId) {
        this.loadBookingDetails(bookingId);
      } else {
        this.errorMessage = 'Invalid booking ID';
      }
    });
  }

  loadBookingDetails(bookingId: number): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.bookingService.getBooking(bookingId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load booking details. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(booking => {
        this.booking = booking;
      });
  }

  cancelBooking(): void {
    if (!this.booking) return;
    
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.bookingService.cancelBooking(this.booking.id)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to cancel booking. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result) {
          this.successMessage = 'Booking cancelled successfully';
          if (this.booking) {
            this.booking.status = 'CANCELLED';
          }
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'badge-success';
      case 'PENDING':
        return 'badge-warning';
      case 'CANCELLED':
        return 'badge-danger';
      case 'COMPLETED':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  getTotalAddonsPrice(): number {
    if (!this.booking || !this.booking.addons) return 0;
    
    return this.booking.addons.reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);
  }
}
