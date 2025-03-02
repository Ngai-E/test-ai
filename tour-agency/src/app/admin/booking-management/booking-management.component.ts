import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { AdminBooking } from '../services/admin.service';

interface BookingFilters {
  search: string;
  packageId: string;
  bookingStatus: string;
  paymentStatus: string;
}

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.scss']
})
export class BookingManagementComponent implements OnInit {
  @ViewChild('bookingDetailsModal') bookingDetailsModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  bookings: AdminBooking[] = [];
  filteredBookings: AdminBooking[] = [];
  packages: any[] = [];
  
  loading = true;
  error = false;
  
  selectedBooking: AdminBooking | null = null;
  bookingToDelete: AdminBooking | null = null;
  
  bookingStatusOptions = ['Pending', 'Confirmed', 'Cancelled'];
  paymentStatusOptions = ['Pending', 'Paid', 'Refunded'];
  
  filters: BookingFilters = {
    search: '',
    packageId: '',
    bookingStatus: '',
    paymentStatus: ''
  };

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
    this.loadPackages();
  }

  loadBookings(): void {
    this.loading = true;
    this.adminService.getBookings().subscribe(
      (data) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading bookings:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  loadPackages(): void {
    this.adminService.getPackages().subscribe(
      (data) => {
        this.packages = data;
      },
      (error) => {
        console.error('Error loading packages:', error);
      }
    );
  }

  refreshBookings(): void {
    this.loadBookings();
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      // Search filter (case insensitive)
      const searchMatch = !this.filters.search || 
        booking.userName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        booking.userEmail.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        booking.packageName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        booking.id.toString().includes(this.filters.search);
      
      // Package filter
      const packageMatch = !this.filters.packageId || 
        booking.packageId.toString() === this.filters.packageId;
      
      // Booking status filter
      const bookingStatusMatch = !this.filters.bookingStatus || 
        booking.status === this.filters.bookingStatus;
      
      // Payment status filter
      const paymentStatusMatch = !this.filters.paymentStatus || 
        booking.paymentStatus === this.filters.paymentStatus;
      
      return searchMatch && packageMatch && bookingStatusMatch && paymentStatusMatch;
    });
  }

  viewBookingDetails(booking: AdminBooking): void {
    this.selectedBooking = booking;
    this.modalService.open(this.bookingDetailsModal, { size: 'lg', centered: true });
  }

  updateBookingStatus(booking: AdminBooking, status: string): void {
    this.adminService.updateBookingStatus(booking.id, status).subscribe(
      (updatedBooking) => {
        booking.status = status;
        this.toastService.showSuccess(`Booking #${booking.id} status updated to ${status}`);
      },
      (error) => {
        console.error('Error updating booking status:', error);
        this.toastService.showError('Failed to update booking status');
      }
    );
  }

  updatePaymentStatus(booking: AdminBooking, paymentStatus: string): void {
    // Since we removed updatePaymentStatus from AdminService, we'll use the general update method
    this.adminService.updateBookingStatus(booking.id, paymentStatus).subscribe(
      (updatedBooking: AdminBooking) => {
        booking.paymentStatus = paymentStatus;
        this.toastService.showSuccess(`Booking #${booking.id} payment status updated to ${paymentStatus}`);
      },
      (error: any) => {
        console.error('Error updating payment status:', error);
        this.toastService.showError('Failed to update payment status');
      }
    );
  }

  confirmDelete(booking: AdminBooking): void {
    this.bookingToDelete = booking;
    this.modalService.open(this.deleteModal, { centered: true });
  }

  deleteBooking(): void {
    if (!this.bookingToDelete) {
      return;
    }
    
    // In a real application, you would call a service method to delete the booking
    // For now, we'll just remove it from the local array
    const index = this.bookings.findIndex(b => b.id === this.bookingToDelete!.id);
    if (index !== -1) {
      this.bookings.splice(index, 1);
      this.applyFilters(); // Reapply filters to update the filtered list
      this.toastService.showSuccess(`Booking #${this.bookingToDelete!.id} deleted successfully`);
      this.modalService.dismissAll();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Refunded':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}
