import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer bg-dark text-light py-4 mt-auto">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Adventure Tours</h5>
            <p class="text-muted">
              Discover the world with us. We provide unforgettable travel experiences 
              and adventures around the globe.
            </p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/" class="text-muted">Home</a></li>
              <li><a routerLink="/packages" class="text-muted">Tour Packages</a></li>
              <li><a routerLink="/about" class="text-muted">About Us</a></li>
              <li><a routerLink="/contact" class="text-muted">Contact</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact Us</h5>
            <ul class="list-unstyled text-muted">
              <li><i class="fas fa-map-marker-alt me-2"></i>123 Adventure St, Travel City</li>
              <li><i class="fas fa-phone me-2"></i>+1 234 567 8900</li>
              <li><i class="fas fa-envelope me-2"></i>info@adventuretours.com</li>
            </ul>
            <div class="social-links mt-3">
              <a href="#" class="text-muted me-3"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-muted me-3"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-muted me-3"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-muted"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <hr class="my-4">
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="mb-0 text-muted">
              © {{ currentYear }} Adventure Tours. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 3rem;
    }
    .footer h5 {
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .footer ul li {
      margin-bottom: 0.5rem;
    }
    .footer a {
      text-decoration: none;
      transition: color 0.2s ease-in-out;
    }
    .footer a:hover {
      color: #fff !important;
    }
    .social-links a {
      font-size: 1.2rem;
      transition: color 0.2s ease-in-out;
    }
    .social-links a:hover {
      color: #fff !important;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
