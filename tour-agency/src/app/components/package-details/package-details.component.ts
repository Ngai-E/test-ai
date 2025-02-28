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
  `]
})
export class PackageDetailsComponent implements OnInit {
  package: any;
  isLoading = true;
  errorMessage: string | null = null;
  bookingForm: FormGroup;
  isLoggedIn = false;

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
      guests: ['', [Validators.required, Validators.min(1)]],
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
    this.packageService.getPackageById(packageId).subscribe({
      next: (packageData) => {
        this.package = packageData;
        this.isLoading = false;
      },
      error: (error) => {
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

    const bookingData: BookingData = {
      guests: this.bookingForm.get('guests')?.value,
      date: this.bookingForm.get('date')?.value,
      specialRequirements: this.bookingForm.get('specialRequirements')?.value
    };

    this.bookingService.createBooking(this.package.id, bookingData).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Booking created successfully');
        this.router.navigate(['/booking-confirmation', response.id]);
      },
      error: (error) => {
        this.toastService.showError('Failed to create booking');
      }
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('fas fa-star');
      } else if (i - 0.5 <= rating) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }
}
