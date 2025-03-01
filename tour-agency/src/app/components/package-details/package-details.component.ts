import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PackageService } from '../../services/package.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';

interface BookingData {
  guests: number;
  date: string;
  specialRequirements?: string;
}

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styles: [`
    .package-details {
      padding: 2rem 0;
    }
    .package-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 0.5rem;
    }
    .package-info {
      margin-top: 2rem;
    }
    .price {
      font-size: 2rem;
      color: #28a745;
      font-weight: bold;
    }
    .rating {
      color: #ffc107;
      margin-right: 0.5rem;
    }
    .booking-form {
      margin-top: 2rem;
      padding: 2rem;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
    }
    .itinerary-details {
      padding-left: 1rem;
      border-left: 3px solid #f8f9fa;
      margin-top: 0.5rem;
    }
  `]
})
export class PackageDetailsComponent implements OnInit {
  package: any;
  isLoading = true;
  errorMessage: string | null = null;
  bookingForm: FormGroup;
  isLoggedIn = false;
  
  // Add missing properties
  selectedPackageType: any = null;
  bookingData = {
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    numberOfPeople: 1,
    specialRequirements: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private packageService: PackageService,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {
    this.bookingForm = this.fb.group({
      guests: ['1', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      specialRequirements: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    const packageId = this.route.snapshot.paramMap.get('id');
    if (!packageId) {
      this.router.navigate(['/packages']);
      return;
    }

    this.loadPackageDetails(parseInt(packageId, 10));
  }

  private loadPackageDetails(packageId: number): void {
    this.isLoading = true;
    this.packageService.getPackageById(packageId).subscribe({
      next: (packageData) => {
        console.log('Package data received:', packageData);
        this.package = packageData;
        this.isLoading = false;
        
        // Set default selected package type if available
        if (this.package.packageTypes && this.package.packageTypes.length > 0) {
          this.selectedPackageType = this.package.packageTypes[0];
        }
      },
      error: (error) => {
        console.error('Error loading package details:', error);
        this.errorMessage = 'Failed to load package details';
        this.isLoading = false;
        this.toastService.showError('Failed to load package details');
      }
    });
  }

  submitBooking(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/packages/${this.package.id}` }
      });
      return;
    }

    if (this.bookingForm.invalid) {
      this.toastService.showError('Please fill in all required fields');
      return;
    }

    const formValue = this.bookingForm.value;

    // Create booking data object that matches what the service expects
    const bookingData = {
      packageId: this.package.id,
      travelDate: formValue.date,
      numberOfPeople: formValue.guests,
      specialRequirements: formValue.specialRequirements || ''
    };

    // Fix the createBooking call to match the expected parameters
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Booking created successfully');
        this.router.navigate(['/booking-confirmation', response.id]);
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.toastService.showError('Failed to create booking');
      }
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push('fas fa-star');
      } else if (i - 0.5 <= ratingValue) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }
}
