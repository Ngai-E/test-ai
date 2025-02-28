import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService, Package } from '../../services/package.service';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
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
