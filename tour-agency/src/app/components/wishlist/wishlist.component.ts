import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styles: [`
    .wishlist-container {
      padding: 2rem;
    }
    .wishlist-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
    }
    .star-rating {
      color: #ffc107;
      margin-right: 0.5rem;
    }
    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #28a745;
    }
    .btn-remove {
      color: #dc3545;
      border-color: #dc3545;
    }
    .btn-remove:hover {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: any[] = [];
  loading = false;
  error: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const authSub = this.authService.currentUser$.subscribe((currentUser: User | null) => {
      if (!currentUser || !currentUser.id) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/wishlist' } });
        return;
      }
      this.loadWishlistItems(currentUser.id);
    });
    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadWishlistItems(userId: number): void {
    const wishlistSub = this.wishlistService.getWishlist(userId).subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load wishlist items';
        this.loading = false;
        this.toastService.showError('Failed to load wishlist items');
      }
    });
    this.subscriptions.push(wishlistSub);
  }

  removeFromWishlist(itemId: number): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      this.toastService.showError('You must be logged in to remove items from your wishlist');
      return;
    }

    this.wishlistService.removeFromWishlist(currentUser.id, itemId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
        this.toastService.showSuccess('Item removed from wishlist');
      },
      error: (error) => {
        this.toastService.showError('Failed to remove item from wishlist');
      }
    });
  }

  viewPackageDetails(packageId: number): void {
    this.router.navigate(['/packages', packageId]);
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
