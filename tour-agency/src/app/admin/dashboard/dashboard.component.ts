import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats } from '../services/admin.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  error = false;
  stats: DashboardStats | null = null;
  
  // Properties for the dashboard metrics
  totalUsers = 0;
  totalBookings = 0;
  totalPackages = 0;
  totalRevenue = 0;
  
  // Data from backend
  popularPackages: any[] = [];
  recentBookings: any[] = [];
  recentReviews: any[] = [];

  // Chart configuration
  revenueChartData: ChartDataSets[] = [];
  revenueChartLabels: Label[] = [];
  revenueChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return '$' + value;
          }
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return '$' + tooltipItem.yLabel;
        }
      }
    }
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  refresh(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe(
      (data) => {
        this.stats = data;
        this.updateMetrics();
        
        // Load additional dashboard data
        this.loadPopularPackages();
        this.loadRecentBookings();
        this.loadRecentReviews();
        this.loadRevenueChartData();
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }
  
  // Update the dashboard metrics from the stats
  updateMetrics(): void {
    if (this.stats) {
      this.totalUsers = this.stats.totalUsers;
      this.totalBookings = this.stats.totalBookings;
      this.totalPackages = this.stats.totalPackages;
      this.totalRevenue = this.stats.totalRevenue;
    }
  }

  // Load popular packages from the backend
  loadPopularPackages(): void {
    this.adminService.getPopularPackages(3).subscribe(
      (data) => {
        this.popularPackages = data;
      },
      (error) => {
        console.error('Error loading popular packages:', error);
        this.popularPackages = [];
      }
    );
  }

  // Load recent bookings from the backend
  loadRecentBookings(): void {
    this.adminService.getRecentBookings(3).subscribe(
      (data) => {
        this.recentBookings = data;
      },
      (error) => {
        console.error('Error loading recent bookings:', error);
        this.recentBookings = [];
      }
    );
  }

  // Load recent reviews from the backend
  loadRecentReviews(): void {
    this.adminService.getRecentReviews(3).subscribe(
      (data) => {
        this.recentReviews = data;
      },
      (error) => {
        console.error('Error loading recent reviews:', error);
        this.recentReviews = [];
      }
    );
  }

  // Load revenue chart data from the backend
  loadRevenueChartData(): void {
    this.adminService.getRevenueByMonth(6).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const months = data.map(item => item.month);
          const revenueData = data.map(item => item.revenue);
          
          this.revenueChartLabels = months;
          this.revenueChartData = [
            {
              data: revenueData,
              label: 'Monthly Revenue',
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
              pointBackgroundColor: '#1976d2',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#1976d2'
            }
          ];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading revenue chart data:', error);
        this.loading = false;
      }
    );
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge bg-secondary';
    
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning text-dark';
      case 'CANCELLED':
        return 'badge bg-danger';
      case 'COMPLETED':
        return 'badge bg-info';
      case 'PROCESSING':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }

  getRatingStars(rating: number): string {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }
    return stars;
  }
}
