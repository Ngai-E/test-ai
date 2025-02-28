import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  cartItemCount = 0;
  private cartSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to auth changes
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
