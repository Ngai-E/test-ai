import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { PackageService } from '../../services/package.service';
import { BookingService, BookingRequest, AddonSelectionDto } from '../../services/booking.service';
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
      font-family: 'Poppins', sans-serif;
      color: #333;
      background-color: #f9fafb;
    }
    
    /* Hero Banner */
    .hero-banner {
      height: 75vh;
      min-height: 550px;
      background-size: cover;
      background-position: center;
      position: relative;
      color: white;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
    }
    
    .hero-content {
      position: relative;
      padding: 8rem 0;
      z-index: 1;
      animation: fadeIn 1s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .badge-container .badge {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Info Cards */
    .info-cards-container {
      margin: -4rem 0 2rem;
      position: relative;
      z-index: 2;
    }
    
    .info-card {
      background: white;
      padding: 1.75rem;
      border-radius: 1rem;
      text-align: center;
      height: 100%;
      transition: all 0.3s;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
      border-bottom: 3px solid transparent;
    }
    
    .info-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.12);
      border-bottom: 3px solid #3f51b5;
    }
    
    .info-card i {
      font-size: 2.25rem;
      color: #3f51b5;
      margin-bottom: 1.25rem;
      transition: all 0.3s;
    }
    
    .info-card:hover i {
      transform: scale(1.2);
    }
    
    .info-card h5 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .info-card p {
      margin-bottom: 0;
      color: #4caf50;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    /* Content Sections */
    .content-section {
      margin-bottom: 3rem;
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 5px 25px rgba(0,0,0,0.05);
      transition: all 0.3s;
      border-left: 5px solid transparent;
    }
    
    .content-section:hover {
      border-left: 5px solid #3f51b5;
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }
    
    .section-title {
      margin-bottom: 1.75rem;
      position: relative;
      padding-bottom: 0.75rem;
      font-weight: 700;
      color: #2c3e50;
      display: inline-block;
    }
    
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(to right, #3f51b5, #4caf50);
      border-radius: 3px;
    }
    
    /* Highlights */
    .highlights-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .highlight-item {
      display: flex;
      align-items: flex-start;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 1rem;
      transition: all 0.3s;
      border: 1px solid #e9ecef;
    }
    
    .highlight-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      background: #fff;
      border-color: #d1d9e6;
    }
    
    .highlight-icon {
      color: #4caf50;
      font-size: 1.75rem;
      margin-right: 1.25rem;
      flex-shrink: 0;
    }
    
    /* Itinerary */
    .accordion-button:not(.collapsed) {
      background-color: #e8f0fe;
      color: #3f51b5;
      font-weight: 600;
    }
    
    .accordion-button:focus {
      box-shadow: none;
      border-color: rgba(0,0,0,.125);
    }
    
    .accordion-item {
      border-radius: 0.75rem;
      overflow: hidden;
      margin-bottom: 1rem;
      border: 1px solid #e9ecef;
    }
    
    .accordion-item:last-child {
      margin-bottom: 0;
    }
    
    .day-number {
      background: #3f51b5;
      color: white;
      padding: 0.35rem 0.85rem;
      border-radius: 50px;
      margin-right: 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(63, 81, 181, 0.2);
    }
    
    .itinerary-details {
      margin-top: 1.5rem;
      background: #f8f9fa;
      padding: 1.75rem;
      border-radius: 1rem;
      border: 1px solid #e9ecef;
    }
    
    .detail-item {
      display: flex;
      margin-bottom: 1.5rem;
      align-items: flex-start;
      padding-bottom: 1.5rem;
      border-bottom: 1px dashed #e9ecef;
    }
    
    .detail-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .detail-item i {
      font-size: 1.75rem;
      color: #3f51b5;
      margin-right: 1.25rem;
      flex-shrink: 0;
      background: #e8f0fe;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .detail-item h6 {
      margin-bottom: 0.25rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    /* Addons */
    .addon-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 1rem;
      padding: 1.75rem;
      height: 100%;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    
    .addon-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    }
    
    .addon-card.selected {
      border-color: #3f51b5;
      box-shadow: 0 5px 20px rgba(63, 81, 181, 0.2);
    }
    
    .addon-card.selected:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 50px 50px 0;
      border-color: transparent #3f51b5 transparent transparent;
    }
    
    .addon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .addon-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4caf50;
      background: #f1f8e9;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
    }
    
    /* Reviews */
    .reviews-container {
      margin-top: 2rem;
    }
    
    .review-card {
      background: #f8f9fa;
      padding: 1.75rem;
      border-radius: 1rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid #3f51b5;
      transition: all 0.3s;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    
    .review-card:hover {
      background: #fff;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .reviewer-info {
      display: flex;
      align-items: center;
    }
    
    .reviewer-avatar {
      width: 50px;
      height: 50px;
      background: #e8f0fe;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1.25rem;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    
    .reviewer-avatar i {
      color: #3f51b5;
      font-size: 1.5rem;
    }
    
    .review-date {
      color: #6c757d;
      font-size: 0.9rem;
      background: #f1f3f5;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
    }
    
    .rating {
      color: #ffc107;
      font-size: 1.1rem;
      margin-top: 0.25rem;
    }
    
    .rating-input {
      font-size: 2.25rem;
      color: #ffc107;
    }
    
    .rating-input i {
      cursor: pointer;
      margin-right: 0.25rem;
      transition: all 0.2s;
    }
    
    .rating-input i:hover {
      transform: scale(1.2);
    }
    
    /* Booking Card */
    .booking-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: sticky;
      top: 2rem;
      transition: all 0.3s;
      border-top: 5px solid #3f51b5;
    }
    
    .booking-card:hover {
      box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }
    
    .price-container {
      text-align: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 1rem;
      margin-bottom: 2rem;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
    }
    
    .price-label {
      display: block;
      font-size: 1rem;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }
    
    .price {
      font-size: 3rem;
      color: #4caf50;
      font-weight: 700;
      line-height: 1;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    }
    
    .price-per {
      display: block;
      font-size: 1rem;
      color: #6c757d;
      margin-top: 0.5rem;
    }
    
    .coin-balance {
      background: #fff9e6;
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
      border-left: 3px solid #ffc107;
    }
    
    .referral-info {
      background: #e6f7ff;
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
      border-left: 3px solid #03a9f4;
    }
    
    .btn-primary {
      background: #3f51b5;
      border-color: #3f51b5;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 0.5rem;
      transition: all 0.3s;
    }
    
    .btn-primary:hover {
      background: #303f9f;
      border-color: #303f9f;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(63, 81, 181, 0.3);
    }
    
    .btn-outline-primary {
      color: #3f51b5;
      border-color: #3f51b5;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 0.5rem;
      transition: all 0.3s;
    }
    
    .btn-outline-primary:hover {
      background: #3f51b5;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(63, 81, 181, 0.3);
    }
    
    .form-control {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid #ced4da;
      transition: all 0.3s;
    }
    
    .form-control:focus {
      border-color: #3f51b5;
      box-shadow: 0 0 0 0.25rem rgba(63, 81, 181, 0.25);
    }
    
    /* Video Modal */
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
      border-radius: 0.75rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.75rem;
    }
    
    .modal-content {
      border-radius: 1rem;
      overflow: hidden;
      border: none;
      box-shadow: 0 15px 50px rgba(0,0,0,0.2);
    }
    
    .modal-header {
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      padding: 1.25rem 1.5rem;
    }
    
    .modal-footer {
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      padding: 1.25rem 1.5rem;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 991.98px) {
      .booking-card {
        margin-top: 2rem;
        position: static;
      }
      
      .hero-banner {
        height: 60vh;
      }
      
      .hero-content {
        padding: 6rem 0;
      }
    }
    
    @media (max-width: 767.98px) {
      .info-cards-container {
        margin-top: 1rem;
      }
      
      .content-section {
        padding: 1.75rem;
      }
      
      .hero-banner {
        height: 50vh;
        min-height: 400px;
      }
      
      .hero-content {
        padding: 4rem 0;
      }
      
      .price {
        font-size: 2.5rem;
      }
    }
    
    @media (max-width: 575.98px) {
      .hero-banner {
        height: 40vh;
        min-height: 350px;
      }
      
      .hero-content {
        padding: 3rem 0;
      }
      
      .content-section {
        padding: 1.5rem;
      }
      
      .booking-card {
        padding: 1.5rem;
      }
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
    // Load user coins
    const coinsSub = this.userService.getUserCoins().subscribe({
      next: (data: any) => {
        this.userCoins = data || 0;
      },
      error: (error) => {
        console.error('Error loading user coins:', error);
      }
    });
    this.subscriptions.push(coinsSub);

    // Load referral code
    const referralSub = this.userService.getReferralCode().subscribe({
      next: (referralCode: string) => {
        this.referralCode = referralCode || '';
      },
      error: (error) => {
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
      next: (hasReviewed: boolean) => {
        this.hasUserReviewed = hasReviewed;
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
    if (this.bookingForm.invalid) {
      this.toastService.showError('Please fill all required fields');
      return;
    }

    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/packages/${this.package.id}` }
      });
      return;
    }

    const formValue = this.bookingForm.value;
    const selectedAddons = this.package.addons.filter((addon: Addon) => addon.selected);
    
    // Create date range (start date to end date based on package duration)
    const startDate = new Date(formValue.date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.package.duration);
    
    // Format dates as ISO strings
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Create booking request according to the API spec
    const bookingRequest: BookingRequest = {
      packageId: this.package.id,
      startDate: startDateStr,
      endDate: endDateStr,
      numberOfAdults: formValue.guests,
      numberOfChildren: 0, // Default to 0 if not specified in the form
      selectedAddons: selectedAddons.map((addon: Addon): AddonSelectionDto => ({
        addonId: addon.id,
        quantity: 1 // Default quantity to 1 if not specified
      })),
      couponCode: '' // Add coupon code if available
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
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
        
        // Close the modal
        this.modalService.dismissAll();

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

  getDayNumbers(): number[] {
    if (!this.package || !this.package.duration) {
      return [1, 2, 3, 4, 5]; // Default 5 days if no duration
    }
    
    // Create an array of day numbers based on the package duration
    return Array.from({ length: this.package.duration }, (_, i) => i + 1);
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
