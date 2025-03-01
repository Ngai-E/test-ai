import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { PackageService, Package } from '../../services/package.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredPackages: Package[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isLoggedIn = false;
  wishlistItems: number[] = [];
  
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private packageService: PackageService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeaturedPackages();
    
    // Subscribe to auth changes
    const authSub = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.loadWishlist();
      } else {
        this.wishlistItems = [];
      }
    });
    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadFeaturedPackages(): void {
    this.isLoading = true;
    const packageSub = this.packageService.getFeaturedPackages().subscribe({
      next: (data: Package[]) => {
        this.featuredPackages = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading featured packages:', error);
        this.errorMessage = 'Failed to load featured packages. Please try again later.';
        this.isLoading = false;
      }
    });
    this.subscriptions.push(packageSub);
  }

  loadWishlist(): void {
    if (!this.isLoggedIn) return;
    
    const wishlistSub = this.wishlistService.getWishlist().subscribe({
      next: (wishlistPackages: Package[]) => {
        this.wishlistItems = wishlistPackages.map(pkg => pkg.id);
      },
      error: (error: any) => {
        console.error('Error loading wishlist:', error);
      }
    });
    this.subscriptions.push(wishlistSub);
  }

  isInWishlist(packageId: number): boolean {
    return this.wishlistItems.includes(packageId);
  }

  toggleWishlist(packageId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/' }
      });
      return;
    }

    if (this.isInWishlist(packageId)) {
      const removeSub = this.wishlistService.removeFromWishlist(packageId).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(id => id !== packageId);
          this.toastService.showSuccess('Removed from wishlist');
        },
        error: (error: any) => {
          console.error('Error removing from wishlist:', error);
          this.toastService.showError('Failed to remove from wishlist');
        }
      });
      this.subscriptions.push(removeSub);
    } else {
      const addSub = this.wishlistService.addToWishlist(packageId).subscribe({
        next: () => {
          this.wishlistItems.push(packageId);
          this.toastService.showSuccess('Added to wishlist');
        },
        error: (error: any) => {
          console.error('Error adding to wishlist:', error);
          this.toastService.showError('Failed to add to wishlist');
        }
      });
      this.subscriptions.push(addSub);
    }
  }

  onLogin(): void {
    if (this.loginData.email && this.loginData.password) {
      this.authService.login(this.loginData.email, this.loginData.password)
        .subscribe({
          next: () => {
            this.toastService.showSuccess('Login successful!');
            this.router.navigate(['/']);
          },
          error: (error: any) => {
            console.error('Login error:', error);
            this.toastService.showError('Login failed. Please check your credentials.');
          }
        });
    }
  }

  showRegisterForm(): void {
    this.router.navigate(['/register']);
  }
}
