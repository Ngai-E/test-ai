import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService, Package } from '../../services/package.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit, OnDestroy {
  packages: Package[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isLoggedIn = false;
  wishlistItems: number[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private packageService: PackageService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPackages();
    
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

  loadPackages(): void {
    this.isLoading = true;
    const packageSub = this.packageService.getAllPackages().subscribe({
      next: (data) => {
        this.packages = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        this.errorMessage = 'Failed to load packages. Please try again later.';
        this.isLoading = false;
      }
    });
    this.subscriptions.push(packageSub);
  }

  loadWishlist(): void {
    if (!this.isLoggedIn) return;
    
    const wishlistSub = this.wishlistService.getWishlist().subscribe({
      next: (wishlistPackages) => {
        this.wishlistItems = wishlistPackages.map(pkg => pkg.id);
      },
      error: (error) => {
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
        queryParams: { returnUrl: '/packages' }
      });
      return;
    }

    if (this.isInWishlist(packageId)) {
      const removeSub = this.wishlistService.removeFromWishlist(packageId).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(id => id !== packageId);
          this.toastService.showSuccess('Removed from wishlist');
        },
        error: (error) => {
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
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.toastService.showError('Failed to add to wishlist');
        }
      });
      this.subscriptions.push(addSub);
    }
  }
}
