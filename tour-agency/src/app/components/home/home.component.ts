import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService, Package } from '../../services/package.service';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
}

interface SpecialOffer {
  title: string;
  discount: number;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredPackages: Package[] = [];
  isLoading = true;
  errorMessage = '';
  
  loginData: LoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      quote: 'The beach resort was absolutely stunning! The staff went above and beyond to make our stay memorable.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Michael Chen',
      location: 'Vancouver, Canada',
      quote: 'Amazing mountain trek experience. Our guide was knowledgeable and professional. Highly recommended!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Emma Wilson',
      location: 'London, UK',
      quote: 'The cultural tour exceeded our expectations. We learned so much about local traditions and history.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];

  specialOffers: SpecialOffer[] = [
    {
      title: 'Early Bird Special',
      discount: 20,
      description: 'Book 3 months in advance and save up to 20% on selected packages'
    },
    {
      title: 'Group Discount',
      discount: 15,
      description: 'Get 15% off when booking for groups of 5 or more'
    },
    {
      title: 'Last Minute Deals',
      discount: 30,
      description: 'Up to 30% off on last-minute bookings for selected destinations'
    }
  ];

  constructor(
    private packageService: PackageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeaturedPackages();
  }

  loadFeaturedPackages(): void {
    this.isLoading = true;
    this.packageService.getAllPackages().subscribe(
      (packages) => {
        this.featuredPackages = packages.slice(0, 4); // Get first 4 packages for featured section
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading packages:', error);
        this.errorMessage = 'Failed to load tour packages. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  onLogin(): void {
    console.log('Login attempted with:', this.loginData);
    alert('Login functionality will be implemented in the next phase');
  }

  showRegisterForm(): void {
    alert('Registration functionality will be implemented in the next phase');
  }
}
