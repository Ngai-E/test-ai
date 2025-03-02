import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('editBookingModal') editBookingModal!: TemplateRef<any>;

  bookings: AdminBooking[] = [];
  filteredBookings: AdminBooking[] = [];
  packages: any[] = [];
  
  selectedBooking: AdminBooking | null = null;
  bookingToDelete: AdminBooking | null = null;
  editingBooking: AdminBooking | null = null;
  editBookingForm!: FormGroup;
  
  loading = true;
  error = false;
  
  bookingStatusOptions = ['PENDING', 'BOOKED', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'Pending', 'Confirmed', 'Cancelled'];
  paymentStatusOptions = ['PENDING', 'PAID', 'REFUNDED', 'FAILED', 'Pending', 'Paid', 'Refunded'];
  
  filters: BookingFilters = {
    search: '',
    packageId: '',
    bookingStatus: '',
    paymentStatus: ''
  };

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadBookings();
    this.loadPackages();
  }

  loadBookings(): void {
    this.loading = true;
    this.adminService.getBookings().subscribe(
      (data) => {
        console.log('Bookings data:', data);
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
    if (!status) return 'bg-secondary';
    
    const normalizedStatus = status.toUpperCase();
    
    switch (normalizedStatus) {
      case 'CONFIRMED':
      case 'BOOKED':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'CANCELLED':
        return 'bg-danger';
      case 'REFUNDED':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getPaymentStatusClass(status: string): string {
    if (!status) return 'bg-secondary';
    
    const normalizedStatus = status.toUpperCase();
    
    switch (normalizedStatus) {
      case 'PAID':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'REFUNDED':
        return 'bg-info';
      case 'FAILED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  calculateAddonTotal(): number {
    if (!this.selectedBooking || !this.selectedBooking.addons || this.selectedBooking.addons.length === 0) {
      return 0;
    }
    
    return this.selectedBooking.addons.reduce((total, addon) => {
      return total + this.calculateAddonItemTotal(addon);
    }, 0);
  }
  
  calculateAddonItemTotal(addon: any): number {
    const price = addon.priceAtBooking || (addon.addon ? addon.addon.price : 0) || 0;
    const quantity = addon.quantity || 1;
    return price * quantity;
  }

  openEditBookingModal(booking: AdminBooking): void {
    this.editingBooking = { ...booking }; // Create a copy to avoid modifying the original
    
    // Initialize the form with the booking data
    this.initEditBookingForm();
    
    // Open the modal
    this.modalService.dismissAll(); // Close any open modals
    this.modalService.open(this.editBookingModal, { size: 'lg', centered: true });
  }

  initEditBookingForm(): void {
    if (!this.editingBooking) return;
    
    // Convert date string to appropriate format for date input (YYYY-MM-DD)
    let travelDate = this.editingBooking.travelDate;
    if (travelDate && typeof travelDate === 'string') {
      // Handle different date formats
      const dateObj = new Date(travelDate);
      if (!isNaN(dateObj.getTime())) {
        travelDate = dateObj.toISOString().split('T')[0];
      }
    }
    
    this.editBookingForm = this.formBuilder.group({
      customerName: [this.editingBooking.userName || '', Validators.required],
      customerEmail: [this.editingBooking.userEmail || '', [Validators.required, Validators.email]],
      customerPhone: [this.editingBooking.userPhone || ''],
      travelDate: [travelDate || '', Validators.required],
      numberOfAdults: [this.editingBooking.numberOfAdults || 1, [Validators.required, Validators.min(1)]],
      numberOfChildren: [this.editingBooking.numberOfChildren || 0, [Validators.required, Validators.min(0)]],
      status: [this.editingBooking.status || 'Pending', Validators.required],
      paymentStatus: [this.editingBooking.paymentStatus || 'Pending', Validators.required],
      amount: [this.editingBooking.amount || 0, [Validators.required, Validators.min(0)]],
      notes: [this.editingBooking.notes || '']
    });
  }

  saveBookingChanges(): void {
    if (this.editBookingForm.invalid || !this.editingBooking) {
      this.toastService.showError('Please fill in all required fields correctly');
      return;
    }

    const formValues = this.editBookingForm.value;
    
    // Create updated booking object
    const updatedBooking: Partial<AdminBooking> = {
      id: this.editingBooking.id,
      userName: formValues.customerName,
      userEmail: formValues.customerEmail,
      userPhone: formValues.customerPhone,
      travelDate: formValues.travelDate,
      numberOfAdults: formValues.numberOfAdults,
      numberOfChildren: formValues.numberOfChildren,
      status: formValues.status,
      paymentStatus: formValues.paymentStatus,
      amount: formValues.amount,
      notes: formValues.notes
    };

    // Call service to update booking
    this.adminService.updateBooking(updatedBooking.id!, updatedBooking).subscribe(
      (response) => {
        // Update the booking in the local array
        const index = this.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          // Merge the updated fields with the existing booking
          this.bookings[index] = { ...this.bookings[index], ...updatedBooking };
          this.applyFilters(); // Refresh the filtered list
        }
        
        this.toastService.showSuccess(`Booking #${updatedBooking.id} updated successfully`);
      },
      (error) => {
        console.error('Error updating booking:', error);
        this.toastService.showError('Failed to update booking');
      }
    );
  }
}
