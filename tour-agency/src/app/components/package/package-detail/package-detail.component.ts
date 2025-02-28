import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  package: any; // Replace 'any' with proper interface
  isInWishlist: boolean = false;
  selectedAddons: {[key: number]: boolean} = {};
  loading: boolean = true;
  error: string | null = null;
  totalPrice: number = 0;
  bookingForm: FormGroup;
  packageId: number = 0;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      travelers: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Get the package ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.packageId = +id;
        this.loadPackageDetails(this.packageId);
      } else {
        // Default to package ID 1 if no ID is provided in the route
        this.packageId = 1;
        this.loadPackageDetails(this.packageId);
      }
    });

    // Initialize form change listeners
    this.bookingForm.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }

  loadPackageDetails(packageId: number): void {
    this.loading = true;
    this.error = null;

    // API endpoint URL using environment configuration
    const apiUrl = `${environment.apiUrl}/packages/${packageId}`;

    this.http.get<any>(apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching package details:', error);
          this.error = 'Failed to load package details. Please try again later.';
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.package = data;
          this.loading = false;
          this.updateTotalPrice();
          
          if (this.package) {
            this.titleService.setTitle(`${this.package.name} - Adventure Tours`);
          }
        }
      });
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
    
    // Call API to update wishlist status
    if (this.packageId) {
      const apiUrl = `${environment.apiUrl}/wishlist/${this.packageId}`;
      const method = this.isInWishlist ? 'POST' : 'DELETE';
      
      this.http.request(method, apiUrl)
        .pipe(
          catchError(error => {
            console.error('Error updating wishlist:', error);
            // Revert the UI state if the API call fails
            this.isInWishlist = !this.isInWishlist;
            return of(null);
          })
        )
        .subscribe();
    }
  }

  bookNow(): void {
    if (!this.bookingForm.valid) {
      return;
    }
    
    const bookingData = {
      packageId: this.packageId,
      startDate: this.bookingForm.value.startDate,
      travelers: this.bookingForm.value.travelers,
      addons: Object.keys(this.selectedAddons)
        .filter(addonId => this.selectedAddons[+addonId])
        .map(addonId => +addonId),
      totalPrice: this.totalPrice
    };
    
    // Call booking API
    const apiUrl = `${environment.apiUrl}/bookings`;
    
    this.http.post(apiUrl, bookingData)
      .pipe(
        catchError(error => {
          console.error('Error creating booking:', error);
          alert('Failed to create booking. Please try again later.');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          alert('Booking created successfully!');
          // Redirect to booking confirmation page or reset form
          this.bookingForm.reset({
            startDate: '',
            travelers: 1
          });
          this.selectedAddons = {};
          this.updateTotalPrice();
        }
      });
  }

  toggleAddon(addonId: number): void {
    this.selectedAddons[addonId] = !this.selectedAddons[addonId];
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    if (!this.package) return;
    
    let total = this.package.basePrice;
    
    // Add prices of selected add-ons
    for (const addonId in this.selectedAddons) {
      if (this.selectedAddons[addonId]) {
        const addon = this.package.addons.find((a: any) => a.id === Number(addonId));
        if (addon) {
          total += addon.price;
        }
      }
    }
    
    // Multiply by number of travelers if available
    const travelers = this.bookingForm.get('travelers')?.value;
    if (travelers && travelers > 0) {
      total *= travelers;
    }
    
    this.totalPrice = total;
  }

  scrollToBooking(): void {
    const bookingElement = document.querySelector('.booking-card');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0).map((_, i) => i);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  retryLoading(): void {
    this.loadPackageDetails(this.packageId);
  }

  shareOnSocial(platform: string): void {
    if (!this.package) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing ${this.package.name} tour package!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
}
