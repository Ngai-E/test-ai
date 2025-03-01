import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Dream Vacations</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/packages" routerLinkActive="active">Packages</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/about" routerLinkActive="active">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active">Contact</a>
            </li>
            <li class="nav-item" *ngIf="currentUser && currentUser.role === 'ADMIN'">
              <a class="nav-link" routerLink="/admin/packages" routerLinkActive="active">Admin</a>
            </li>
          </ul>
          
          <!-- User not logged in -->
          <ul class="navbar-nav ms-auto" *ngIf="!isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register" routerLinkActive="active">Register</a>
            </li>
          </ul>
          
          <!-- User logged in -->
          <ul class="navbar-nav ms-auto" *ngIf="isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/wishlist" routerLinkActive="active">
                <i class="fa fa-heart"></i> Wishlist
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                <i class="fa fa-shopping-cart"></i> Cart
                <span *ngIf="cartItemCount > 0" class="badge bg-primary">{{ cartItemCount }}</span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-user-circle"></i> {{ currentUser?.firstName || 'Account' }}
                <span *ngIf="currentUser?.coins > 0" class="badge bg-warning text-dark ms-1">{{ currentUser?.coins }} coins</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" routerLink="/profile">My Profile</a></li>
                <li><a class="dropdown-item" routerLink="/bookings">My Bookings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout($event)" style="cursor: pointer;">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
    .nav-link {
      font-size: 1rem;
      padding: 0.5rem 1rem;
      transition: color 0.2s ease-in-out;
    }
    .nav-link:hover {
      color: #ffc107 !important;
    }
    .nav-link.active {
      color: #ffc107 !important;
    }
    .dropdown-menu {
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .dropdown-item {
      padding: 0.5rem 1.5rem;
      transition: background-color 0.2s ease-in-out;
    }
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  cartItemCount = 0;
  private cartSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      
      // If user is logged in, get cart count
      if (user) {
        this.subscribeToCart();
      } else {
        this.cartItemCount = 0;
        if (this.cartSubscription) {
          this.cartSubscription.unsubscribe();
          this.cartSubscription = null;
        }
      }
    });
  }
  
  private subscribeToCart(): void {
    // Unsubscribe if already subscribed
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    
    // Subscribe to cart changes
    this.cartSubscription = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  logout(event: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
