import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';
  successMessage = '';
  statusFilter = 'all';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check for success message from query params
    this.route.queryParams.subscribe(params => {
      if (params['success']) {
        this.successMessage = 'Your booking has been successfully created!';
        setTimeout(() => this.successMessage = '', 5000); // Hide after 5 seconds
      }
    });

    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id !== undefined) {
      this.loadBookings(currentUser.id);
    } else {
      this.error = 'You must be logged in to view bookings';
      this.loading = false;
    }
  }

  loadBookings(userId: number): void {
    this.loading = true;
    
    if (this.statusFilter === 'all') {
      // Use the updated getUserBookings method without parameters
      this.bookingService.getUserBookings().subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load bookings. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.bookingService.getUserBookingsByStatus(userId, this.statusFilter).subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load bookings. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  filterBookings(status: string): void {
    this.statusFilter = status;
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id !== undefined) {
      this.loadBookings(currentUser.id);
    }
  }

  cancelBooking(bookingId: number): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || currentUser.id === undefined) return;

    // Use the cancelBookingForUser method instead
    this.bookingService.cancelBookingForUser(currentUser.id, bookingId).subscribe({
      next: (booking) => {
        // Update the booking in the list
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = booking;
        }
      },
      error: (error) => {
        this.error = 'Failed to cancel booking. Please try again.';
      }
    });
  }
}
