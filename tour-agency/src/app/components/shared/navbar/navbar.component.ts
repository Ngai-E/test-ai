import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Adventure Tours</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!isLoggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Register</a>
              </li>
            </ng-container>
            <ng-container *ngIf="isLoggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/wishlist" routerLinkActive="active">
                  <i class="fas fa-heart"></i> Wishlist
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                  <i class="fas fa-shopping-cart"></i> Cart
                </a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user"></i> {{ currentUser?.firstName || 'Account' }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" routerLink="/profile">Profile</a></li>
                  <li><a class="dropdown-item" routerLink="/bookings">My Bookings</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout($event)">Logout</a></li>
                </ul>
              </li>
            </ng-container>
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
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
