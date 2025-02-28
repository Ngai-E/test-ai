import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Package } from '../../services/package.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Package[] = [];
  loading = true;
  error = '';

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(currentUser => {
      if (currentUser && currentUser.id) {
        this.loadWishlist(currentUser.id);
      }
    });
  }

  loadWishlist(userId: number): void {
    this.loading = true;
    this.wishlistService.getWishlist(userId).subscribe({
      next: (packages) => {
        this.wishlistItems = packages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load wishlist. Please try again.';
        this.loading = false;
      }
    });
  }

  removeFromWishlist(packageId: number): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) return;

    this.wishlistService.removeFromWishlist(currentUser.id, packageId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== packageId);
      },
      error: (error) => {
        this.error = 'Failed to remove item from wishlist. Please try again.';
      }
    });
  }

  viewPackageDetails(packageId: number): void {
    this.router.navigate(['/packages', packageId]);
  }
}
