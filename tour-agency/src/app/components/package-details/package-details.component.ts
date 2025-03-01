import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { PackageService } from '../../services/package.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';

interface BookingData {
  guests: number;
  date: string;
  specialRequirements?: string;
  addons?: any[];
}

interface Addon {
  id: number;
  name: string;
  price: number;
  description: string;
  videoUrl?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styles: [`
    .package-details {
      padding-bottom: 3rem;
    }
    .hero-section {
      height: 500px;
      background-size: cover;
      background-position: center;
      position: relative;
      color: white;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .hero-content {
      position: relative;
      padding: 6rem 0;
      z-index: 1;
    }
    .rating {
      color: #ffc107;
    }
    .info-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
      height: 100%;
      transition: all 0.3s;
    }
    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .info-card i {
      font-size: 2rem;
      color: #007bff;
      margin-bottom: 1rem;
    }
    .info-card h5 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .info-card p {
      margin-bottom: 0;
      color: #6c757d;
    }
    .package-section {
      margin-bottom: 3rem;
    }
    .section-title {
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.5rem;
    }
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: #007bff;
    }
    .highlights-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .highlight-item {
      display: flex;
      align-items: flex-start;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s;
    }
    .highlight-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .highlight-icon {
      color: #28a745;
      font-size: 1.5rem;
      margin-right: 1rem;
    }
    .day-number {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      margin-right: 1rem;
      font-size: 0.9rem;
    }
    .itinerary-details {
      margin-top: 1.5rem;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
    }
    .detail-item {
      display: flex;
      margin-bottom: 1.5rem;
    }
    .detail-item:last-child {
      margin-bottom: 0;
    }
    .detail-item i {
      font-size: 1.5rem;
      color: #007bff;
      margin-right: 1rem;
      margin-top: 0.25rem;
    }
    .detail-item h6 {
      margin-bottom: 0.5rem;
      color: #343a40;
    }
    .activities-list {
      padding-left: 1.25rem;
      margin-bottom: 0;
    }
    .activities-list li {
      margin-bottom: 0.5rem;
    }
    .activities-list li:last-child {
      margin-bottom: 0;
    }
    .included-list, .excluded-list {
      list-style: none;
      padding-left: 0;
    }
    .included-list li, .excluded-list li {
      margin-bottom: 0.75rem;
      display: flex;
      align-items: flex-start;
    }
    .included-list li i, .excluded-list li i {
      margin-top: 0.25rem;
      margin-right: 0.75rem;
    }
    .addons-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .addon-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s;
    }
    .addon-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .addon-price {
      color: #28a745;
      font-weight: normal;
      font-size: 0.9rem;
    }
    .booking-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      position: sticky;
      top: 2rem;
    }
    .price {
      font-size: 2rem;
      color: #28a745;
      font-weight: bold;
    }
    .coin-balance {
      background: #fff9e6;
      padding: 0.75rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
    }
    .referral-info {
      background: #e6f7ff;
      padding: 0.75rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
    }
    .reviews-container {
      margin-top: 2rem;
    }
    .review-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .reviewer-info {
      display: flex;
      align-items: center;
    }
    .reviewer-avatar {
      width: 40px;
      height: 40px;
      background: #e9ecef;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }
    .reviewer-avatar i {
      color: #6c757d;
    }
    .review-date {
      color: #6c757d;
      font-size: 0.9rem;
    }
    .rating-input {
      font-size: 2rem;
      color: #ffc107;
    }
    .rating-input i {
      cursor: pointer;
      margin-right: 0.25rem;
    }
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `]
})
export class PackageDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('reviewModal') reviewModal: any;
  @ViewChild('videoModal') videoModal: any;

  package: any;
  isLoading = true;
  errorMessage: string | null = null;
  bookingForm: FormGroup;
  reviewForm: FormGroup;
  isLoggedIn = false;
  currentUser: any = null;
  isInWishlist = false;
  selectedRating = 0;
  hoverRating = 0;
  hasUserReviewed = false;
  selectedAddon: Addon | null = null;
  sanitizedVideoUrl: SafeResourceUrl | null = null;
  basePrice = 0;
  totalPrice = 0;
  userCoins = 0;
  referralCode = '';
  selectedPackageType: any = null;
  bookingData: any = {
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    numberOfPeople: 1,
    specialRequirements: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private packageService: PackageService,
    private bookingService: BookingService,
    private toastService: ToastService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private userService: UserService,
    private reviewService: ReviewService
  ) {
    this.bookingForm = this.fb.group({
      guests: [1, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      specialRequirements: [''],
      useCoin: [false]
    });

    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to auth changes
    const authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;

      if (user) {
        this.loadUserData();
      }
    });
    this.subscriptions.push(authSub);

    const packageId = this.route.snapshot.paramMap.get('id');
    if (!packageId) {
      this.router.navigate(['/packages']);
      return;
    }

    this.loadPackageDetails(parseInt(packageId, 10));
  }

  private loadUserData(): void {
    if (!this.currentUser) return;

    // Load user coins
    const coinsSub = this.userService.getUserCoins().subscribe({
      next: (data: any) => {
        this.userCoins = data?.coinBalance || 0;
      },
      error: (error: any) => {
        console.error('Error loading user coins:', error);
      }
    });
    this.subscriptions.push(coinsSub);

    // Load referral code
    const referralSub = this.userService.getReferralCode().subscribe({
      next: (data: any) => {
        this.referralCode = data?.referralCode || '';
      },
      error: (error: any) => {
        console.error('Error loading referral code:', error);
      }
    });
    this.subscriptions.push(referralSub);
  }

  private loadPackageDetails(packageId: number): void {
    this.isLoading = true;
    this.packageService.getPackageById(packageId).subscribe({
      next: (packageData) => {
        console.log('Package data received:', packageData);
        this.package = packageData;
        this.isLoading = false;

        // Set base price
        this.basePrice = this.package.basePrice || 0;
        this.totalPrice = this.basePrice;

        // Initialize addons if they exist
        if (this.package.addons && this.package.addons.length > 0) {
          this.package.addons.forEach((addon: Addon) => {
            addon.selected = false;
          });
        }

        // Check if package is in user's wishlist
        if (this.isLoggedIn) {
          this.checkWishlistStatus();
          this.checkUserReviewStatus();
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

  private checkWishlistStatus(): void {
    if (!this.isLoggedIn || !this.package) return;

    const wishlistSub = this.wishlistService.checkWishlistStatus(this.package.id).subscribe({
      next: (status) => {
        this.isInWishlist = status.inWishlist;
      },
      error: (error) => {
        console.error('Error checking wishlist status:', error);
      }
    });
    this.subscriptions.push(wishlistSub);
  }

  private checkUserReviewStatus(): void {
    if (!this.isLoggedIn || !this.package) return;

    const reviewSub = this.reviewService.hasUserReviewed(this.package.id).subscribe({
      next: (status: any) => {
        this.hasUserReviewed = status?.hasReviewed || false;
      },
      error: (error) => {
        console.error('Error checking review status:', error);
      }
    });
    this.subscriptions.push(reviewSub);
  }

  toggleWishlist(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/packages/${this.package.id}` }
      });
      return;
    }

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.package.id).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.toastService.showSuccess('Removed from wishlist');
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.toastService.showError('Failed to remove from wishlist');
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.package.id).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.toastService.showSuccess('Added to wishlist');
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.toastService.showError('Failed to add to wishlist');
        }
      });
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/packages/${this.package.id}` }
      });
      return;
    }

    const selectedAddons = this.package.addons && this.package.addons.length > 0 ?
      this.package.addons.filter((addon: Addon) => addon.selected) : [];

    const formValue = this.bookingForm.value;
    const startDate = formValue.date || new Date().toISOString().split('T')[0];
    // Calculate end date (assuming package duration is in days)
    const endDate = new Date(new Date(startDate).getTime() + (this.package.duration || 1) * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const addonSelections = selectedAddons.map((addon: Addon) => ({
      addonId: addon.id,
      quantity: 1
    }));

    this.cartService.addToCart(
      this.package.id,
      startDate,
      endDate,
      formValue.guests || 1,
      0, // numberOfChildren
      addonSelections
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Added to cart');
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);
        this.toastService.showError('Failed to add to cart');
      }
    });
  }

  updateTotalPrice(): void {
    if (!this.package) return;

    const guests = this.bookingForm.value.guests || 1;
    let total = this.basePrice * guests;

    // Add selected addons
    if (this.package.addons && this.package.addons.length > 0) {
      this.package.addons.forEach((addon: Addon) => {
        if (addon.selected) {
          total += addon.price * guests;
        }
      });
    }

    // Apply coin discount if selected
    if (this.bookingForm.value.useCoin && this.userCoins > 0) {
      // Assuming 1 coin = $1 discount
      const maxDiscount = Math.min(this.userCoins, total * 0.1); // Max 10% discount
      total -= maxDiscount;
    }

    this.totalPrice = total;
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

    // Get selected addons
    const selectedAddons = this.package.addons && this.package.addons.length > 0 ?
      this.package.addons.filter((addon: Addon) => addon.selected) : [];

    // Create booking data object that matches what the service expects
    const bookingData = {
      packageId: this.package.id,
      travelDate: formValue.date,
      numberOfPeople: formValue.guests,
      specialRequirements: formValue.specialRequirements || '',
      addons: selectedAddons.map((addon: Addon) => addon.id),
      useCoins: formValue.useCoin
    };

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

  openReviewModal(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/packages/${this.package.id}` }
      });
      return;
    }

    this.modalService.open(this.reviewModal, { centered: true });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.toastService.showError('Please provide a rating and comment');
      return;
    }

    const reviewData = {
      packageId: this.package.id,
      rating: this.selectedRating,
      comment: this.reviewForm.value.comment
    };

    this.reviewService.submitReview(reviewData).subscribe({
      next: () => {
        this.toastService.showSuccess('Review submitted successfully');
        this.hasUserReviewed = true;

        // Reload package to get updated reviews
        this.loadPackageDetails(this.package.id);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.toastService.showError('Failed to submit review');
      }
    });
  }

  openVideoModal(addon: Addon): void {
    this.selectedAddon = addon;

    if (addon.videoUrl) {
      this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(addon.videoUrl);
    }

    this.modalService.open(this.videoModal, { centered: true, size: 'lg' });
  }

  selectAddon(addon: Addon | null): void {
    if (!addon) return;

    // Toggle the selected state
    addon.selected = true;

    // Update total price
    this.updateTotalPrice();
  }

  copyReferralCode(): void {
    if (!this.referralCode) return;

    navigator.clipboard.writeText(this.referralCode).then(() => {
      this.toastService.showSuccess('Referral code copied to clipboard');
    }, (err) => {
      console.error('Could not copy text: ', err);
      this.toastService.showError('Failed to copy referral code');
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
