import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
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
    private router: Router
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
    this.filteredBookings = this.bookings.filter(booking => {
      // Apply status filter
      if (this.statusFilter !== 'all' && booking.status.toLowerCase() !== this.statusFilter.toLowerCase()) {
        return false;
      }
      
      // Apply search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          booking.package.name.toLowerCase().includes(searchLower) ||
          booking.package.destination.toLowerCase().includes(searchLower) ||
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
    this.errorMessage = '';
    
    this.bookingService.cancelBooking(bookingId)
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
          // Update the booking status in the local array
          const booking = this.bookings.find(b => b.id === bookingId);
          if (booking) {
            booking.status = 'CANCELLED';
          }
          
          // Reapply filters
          this.onFilterChange();
        }
      });
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
}
