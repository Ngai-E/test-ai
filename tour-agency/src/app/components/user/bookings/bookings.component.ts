import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { ToastService } from '../../../services/toast.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  statusFilter = 'all';
  searchTerm = '';

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.bookingService.getUserBookings()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load bookings. Please try again.';
          console.error('Error loading bookings:', error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(bookings => {
        this.bookings = bookings;
        this.filteredBookings = [...bookings];
        this.onFilterChange();
      });
  }

  onFilterChange(): void {
    if (!this.bookings || this.bookings.length === 0) {
      this.filteredBookings = [];
      return;
    }
    
    this.filteredBookings = this.bookings.filter(booking => {
      // Apply status filter
      if (this.statusFilter !== 'all' && booking.status.toLowerCase() !== this.statusFilter.toLowerCase()) {
        return false;
      }
      
      // Apply search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          (booking.package?.name?.toLowerCase().includes(searchLower) || false) ||
          (booking.package?.destination?.toLowerCase().includes(searchLower) || false) ||
          (booking.bookingReference?.toLowerCase().includes(searchLower) || false) ||
          booking.id.toString().includes(searchLower)
        );
      }
      
      return true;
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.onFilterChange();
  }

  viewBookingDetails(bookingId: number): void {
    this.router.navigate(['/bookings', bookingId]);
  }

  cancelBooking(bookingId: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    this.loading = true;
    
    this.bookingService.cancelBooking(bookingId)
      .pipe(
        catchError(error => {
          this.toastService.showError('Failed to cancel booking. Please try again.');
          console.error('Error cancelling booking:', error);
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result) {
          this.toastService.showSuccess('Booking cancelled successfully');
          
          // Update the booking status in the local array
          const booking = this.bookings.find(b => b.id === bookingId);
          if (booking) {
            booking.status = 'cancelled';
          }
          
          // Reapply filters
          this.onFilterChange();
        }
      });
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
}
