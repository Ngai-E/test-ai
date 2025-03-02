import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  bookingId: number = 0;
  booking: Booking | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
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
    if (!this.booking) {
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

  getStatusClass(status: string): string {
    if (!status) return 'badge-secondary';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      case 'completed':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  calculateTotalAddonsPrice(): number {
    if (!this.booking || !this.booking.addons) return 0;
    
    return this.booking.addons.reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);
  }

  getUserName(): string {
    // Get the current user's name since it's not in the booking object
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.fullName || 'N/A';
  }
  
  getUserEmail(): string {
    // Get the current user's email
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.email || 'N/A';
  }
  
  getUserPhone(): string {
    // Get the current user's phone
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.phoneNumber || 'N/A';
  }

  printBooking(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/user/bookings']);
  }
}
