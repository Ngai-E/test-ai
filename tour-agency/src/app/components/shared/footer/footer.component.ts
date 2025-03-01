import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <!-- Company Info -->
          <div class="col-lg-4 mb-4 mb-lg-0">
            <h5>About TourAgency</h5>
            <p>We specialize in creating unforgettable travel experiences. Our expert team ensures every journey is filled with adventure, comfort, and lasting memories.</p>
            <div class="social-links">
              <a href="#" class="me-3"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="me-3"><i class="fab fa-twitter"></i></a>
              <a href="#" class="me-3"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/packages">Tour Packages</a></li>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact</a></li>
            </ul>
          </div>

          <!-- Popular Destinations -->
          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5>Popular Destinations</h5>
            <ul class="list-unstyled">
              <li><a href="#">Bali, Indonesia</a></li>
              <li><a href="#">Santorini, Greece</a></li>
              <li><a href="#">Swiss Alps</a></li>
              <li><a href="#">Machu Picchu, Peru</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-3">
            <h5>Contact Us</h5>
            <ul class="list-unstyled contact-info">
              <li><i class="fas fa-map-marker-alt"></i> 123 Travel Street, City, Country</li>
              <li><i class="fas fa-phone"></i> +1 234 567 890</li>
              <li><i class="fas fa-envelope"></i> info@touragency.com</li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <div class="row">
            <div class="col-md-6">
              <p class="mb-0">&copy; {{ currentYear }} TourAgency. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-md-end">
              <a href="#" class="me-3">Privacy Policy</a>
              <a href="#" class="me-3">Terms & Conditions</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #343a40;
      color: #fff;
      padding: 4rem 0 2rem;
      margin-top: 3rem;
    }
    .footer h5 {
      color: #fff;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .footer p {
      color: #adb5bd;
    }
    .footer a {
      color: #adb5bd;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer a:hover {
      color: #fff;
      text-decoration: none;
    }
    .footer ul li {
      margin-bottom: 0.75rem;
    }
    .social-links a {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      text-align: center;
      line-height: 36px;
      transition: all 0.3s;
    }
    .social-links a:hover {
      background: #ffc107;
      color: #343a40;
    }
    .contact-info li {
      margin-bottom: 1rem;
      display: flex;
      align-items: flex-start;
    }
    .contact-info i {
      margin-right: 0.75rem;
      color: #ffc107;
    }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 2rem;
      margin-top: 3rem;
    }
    .footer-bottom p, .footer-bottom a {
      color: #adb5bd;
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
