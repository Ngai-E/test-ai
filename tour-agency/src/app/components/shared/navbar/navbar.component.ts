import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Dream Vacations Logo" height="30" class="d-inline-block align-text-top me-2">
          Dream Vacations
        </a>
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
            <li class="nav-item">
              <a class="nav-link position-relative" (click)="toggleNotifications($event)" style="cursor: pointer;">
                <i class="fa fa-bell"></i>
                <span *ngIf="unreadNotificationsCount > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {{ unreadNotificationsCount }}
                </span>
              </a>
              <div *ngIf="showNotifications" class="notification-dropdown">
                <div class="notification-header">
                  <h6 class="mb-0">Notifications</h6>
                  <button *ngIf="notifications.length > 0" class="btn btn-sm btn-link" (click)="markAllAsRead()">Mark all as read</button>
                </div>
                <div class="notification-body">
                  <div *ngIf="notifications.length === 0" class="text-center py-3">
                    <p class="text-muted mb-0">No notifications</p>
                  </div>
                  <div *ngFor="let notification of notifications" 
                       class="notification-item" 
                       [class.unread]="!notification.read"
                       (click)="readNotification(notification)">
                    <div class="notification-content">
                      <p class="notification-text mb-0">{{ notification.message }}</p>
                      <small class="notification-time">{{ notification.createdAt | date:'short' }}</small>
                    </div>
                  </div>
                </div>
              </div>
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
    .notification-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 320px;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      overflow: hidden;
    }
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    .notification-body {
      max-height: 300px;
      overflow-y: auto;
    }
    .notification-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f1f1;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    .notification-item.unread {
      background-color: #e8f4fd;
    }
    .notification-text {
      color: #212529;
    }
    .notification-time {
      color: #6c757d;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  cartItemCount = 0;
  notifications: any[] = [];
  unreadNotificationsCount = 0;
  showNotifications = false;
  
  private cartSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;
  private notificationSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      
      // If user is logged in, get cart count and notifications
      if (user) {
        this.subscribeToCart();
        this.loadNotifications();
      } else {
        this.cartItemCount = 0;
        this.notifications = [];
        this.unreadNotificationsCount = 0;
        
        if (this.cartSubscription) {
          this.cartSubscription.unsubscribe();
          this.cartSubscription = null;
        }
        
        if (this.notificationSubscription) {
          this.notificationSubscription.unsubscribe();
          this.notificationSubscription = null;
        }
      }
    });
    
    // Close notifications dropdown when clicking outside
    document.addEventListener('click', this.closeNotificationsOnClickOutside.bind(this));
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
  
  private loadNotifications(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    
    this.notificationSubscription = this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        this.unreadNotificationsCount = notifications.filter(n => !n.read).length;
      },
      error => console.error('Error loading notifications:', error)
    );
  }
  
  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }
  
  readNotification(notification: any): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(
        () => {
          notification.read = true;
          this.unreadNotificationsCount = Math.max(0, this.unreadNotificationsCount - 1);
        },
        error => console.error('Error marking notification as read:', error)
      );
    }
    
    // Navigate if there's a link
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
      this.showNotifications = false;
    }
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadNotificationsCount = 0;
      },
      error => console.error('Error marking all notifications as read:', error)
    );
  }
  
  private closeNotificationsOnClickOutside(event: MouseEvent): void {
    if (this.showNotifications) {
      const target = event.target as HTMLElement;
      const notificationDropdown = document.querySelector('.notification-dropdown');
      const notificationToggle = document.querySelector('.nav-link[style="cursor: pointer;"]');
      
      if (notificationDropdown && 
          !notificationDropdown.contains(target) && 
          notificationToggle && 
          !notificationToggle.contains(target)) {
        this.showNotifications = false;
      }
    }
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
    
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    
    // Remove event listener
    document.removeEventListener('click', this.closeNotificationsOnClickOutside.bind(this));
  }
}
