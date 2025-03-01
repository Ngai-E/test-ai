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
        const bookingId = +params['id'];
        this.loadBookingDetails(bookingId);
      } else {
        this.errorMessage = 'Booking ID not found';
        this.isLoading = false;
      }
    });
  }

  loadBookingDetails(bookingId: number): void {
    this.bookingService.getBooking(bookingId)
      .subscribe({
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
      
      this.bookingService.cancelBooking(this.booking.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Booking cancelled successfully');
          this.booking!.status = 'cancelled';
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

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge-secondary';
    
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
