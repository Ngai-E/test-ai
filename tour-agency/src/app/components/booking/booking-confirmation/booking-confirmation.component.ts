import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  bookingId: number = 0;
  booking: Booking | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  currentUser: User | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.bookingId = +params['id'];
        this.loadBookingDetails();
      } else {
        this.errorMessage = 'Booking ID not found';
        this.isLoading = false;
      }
    });
  }

  loadBookingDetails(): void {
    this.bookingService.getUserBookingById(this.bookingId).subscribe({
      next: (booking: Booking) => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load booking details';
        this.isLoading = false;
        console.error('Error loading booking:', error);
      }
    });
  }

  cancelBooking(): void {
    if (!this.booking || !this.currentUser) {
      this.toastService.showError('Unable to cancel booking. Please try again later.');
      return;
    }
    
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.isLoading = true;
      
      this.bookingService.cancelBooking(this.bookingId).subscribe({
        next: (updatedBooking: Booking) => {
          this.toastService.showSuccess('Booking cancelled successfully');
          this.booking = updatedBooking;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.toastService.showError('Failed to cancel booking');
          this.isLoading = false;
          console.error('Error cancelling booking:', error);
        }
      });
    }
  }

  printBooking(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/user/bookings']);
  }
  
  getTotalAddonsPrice(): number {
    if (!this.booking || !this.booking.addons) return 0;
    
    return this.booking.addons.reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);
  }
}
