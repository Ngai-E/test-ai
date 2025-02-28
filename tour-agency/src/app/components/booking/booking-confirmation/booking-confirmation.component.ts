import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  loading = true;
  error = '';
  bookingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.bookingId = +params['id'];
        this.loadBooking();
      } else {
        this.error = 'Booking ID not found';
        this.loading = false;
      }
    });
  }

  loadBooking(): void {
    if (!this.bookingId) return;

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.error = 'You must be logged in to view booking details';
      this.loading = false;
      return;
    }

    this.bookingService.getBooking(this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load booking details. Please try again.';
        this.loading = false;
      }
    });
  }

  viewAllBookings(): void {
    this.router.navigate(['/bookings']);
  }

  cancelBooking(): void {
    if (!this.bookingId) {
      console.error('Booking ID is undefined');
      return;
    }
    
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loading = true;
    this.bookingService.cancelBookingForUser(currentUser.id as number, Number(this.bookingId)).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to cancel booking. Please try again.';
        this.loading = false;
      }
    });
  }
}
