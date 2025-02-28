import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

    // API endpoint URL
    const apiUrl = `http://localhost:3000/api/packages/${packageId}`;

    this.http.get<any>(apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching package details:', error);
          this.error = 'Failed to load package details. Please try again later.';
          return of(null);
        }),
        finalize(() => {
          // For demo purposes, if the API call fails, use mock data
          if (this.error && packageId === 1) {
            this.useMockData();
          }
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

  // Fallback to mock data for demo purposes
  private useMockData(): void {
    this.package = {
      id: 1,
      name: "Swiss Alps Adventure",
      description: "Experience the majestic Swiss Alps with this comprehensive tour package that combines adventure, luxury, and natural beauty.",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35",
      overview: "Embark on an unforgettable journey through the Swiss Alps, combining thrilling outdoor activities with luxurious accommodations and authentic Swiss experiences.",
      duration: 7,
      groupSize: "8-12 people",
      transportation: "Private minibus and mountain railways",
      accommodation: "4-star mountain hotels",
      meals: "Full board (Breakfast, Lunch, Dinner)",
      bestTimeToVisit: "June to September",
      basePrice: 1500,
      bookingCount: 12,
      averageRating: 4.7,
      addons: [
        {
          id: 1,
          name: "5-Star Hotel Upgrade",
          description: "Upgrade to a luxurious 5-star hotel experience",
          detailedDescription: "Enjoy the ultimate luxury with our 5-star hotel upgrade. Experience world-class amenities, stunning views, and impeccable service.",
          price: 500,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=500",
          videoUrl: "https://example.com/videos/5star-hotel-tour.mp4",
          category: "ACCOMMODATION"
        },
        {
          id: 2,
          name: "Helicopter City Tour",
          description: "See the Alps from above with a thrilling helicopter tour",
          detailedDescription: "Experience the breathtaking Alpine skyline from a bird's eye view. This 30-minute helicopter tour takes you over iconic landmarks.",
          price: 350,
          imageUrl: "https://images.unsplash.com/photo-1473862170180-84427c485aca?auto=format&fit=crop&w=800&h=500",
          videoUrl: "https://example.com/videos/helicopter-tour.mp4",
          category: "ACTIVITY"
        },
        {
          id: 3,
          name: "Desert Safari with BBQ Dinner",
          description: "Thrilling desert adventure with traditional dinner",
          detailedDescription: "Experience the magic of the desert with our premium safari package. Enjoy dune bashing, sandboarding, camel rides, and a traditional BBQ dinner under the stars.",
          price: 120,
          imageUrl: "https://images.unsplash.com/photo-1547823065-4cbbb3d9d463?auto=format&fit=crop&w=800&h=500",
          videoUrl: "https://example.com/videos/desert-safari.mp4",
          category: "ACTIVITY"
        },
        {
          id: 4,
          name: "Private Luxury Transportation",
          description: "Dedicated luxury vehicle with personal chauffeur",
          detailedDescription: "Travel in style with our private luxury transportation service. A dedicated professional chauffeur will be at your service throughout your stay.",
          price: 800,
          imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&h=500",
          videoUrl: "https://example.com/videos/luxury-transport.mp4",
          category: "TRANSPORTATION"
        }
      ],
      itinerary: [
        {
          id: 1,
          dayNumber: 1,
          title: "Arrival in Zurich",
          description: "Welcome to Switzerland! Arrive in Zurich and transfer to your hotel in the heart of the Swiss Alps. Evening welcome dinner and trip briefing.",
          accommodation: "Mountain Lodge Zurich",
          meals: "Dinner",
          activities: []
        },
        {
          id: 2,
          dayNumber: 2,
          title: "Jungfraujoch Experience",
          description: "Take the scenic train journey to Jungfraujoch, the 'Top of Europe'. Visit the Ice Palace and enjoy panoramic views from the Sphinx Observatory.",
          accommodation: "Mountain Lodge Grindelwald",
          meals: "Breakfast, Lunch, Dinner",
          activities: []
        }
      ],
      highlights: [
        "Guided hiking through scenic Alpine trails",
        "Cable car ride to Jungfraujoch - Top of Europe",
        "Traditional Swiss cheese and chocolate tasting"
      ],
      included: [
        "All accommodations in 4-star hotels",
        "Professional mountain guide",
        "All meals and snacks"
      ],
      excluded: [
        "International flights",
        "Personal equipment and gear"
      ],
      reviews: [
        {
          id: 1,
          rating: 5,
          comment: "Amazing experience! The tour exceeded all my expectations.",
          createdAt: "2025-01-15T14:30:00",
          updatedAt: "2025-01-15T14:30:00"
        }
      ]
    };

    this.loading = false;
    this.error = null;
    this.updateTotalPrice();
    
    if (this.package) {
      this.titleService.setTitle(`${this.package.name} - Adventure Tours`);
    }
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
    
    // Call API to update wishlist status
    if (this.packageId) {
      const apiUrl = `http://localhost:3000/api/wishlist/${this.packageId}`;
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
    const apiUrl = 'http://localhost:3000/api/bookings';
    
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
