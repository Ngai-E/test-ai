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
  
  // Mock data for components that expect the old dashboard structure
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
        this.generateMockData();
        this.configureRevenueChart();
        this.loading = false;
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

  // Generate mock data for components that expect the old dashboard structure
  generateMockData(): void {
    if (this.stats) {
      // Create mock popular packages
      this.popularPackages = [
        { name: 'Paris Adventure', destination: 'Paris, France', bookings: 24 },
        { name: 'Tokyo Explorer', destination: 'Tokyo, Japan', bookings: 18 },
        { name: 'New York City Tour', destination: 'New York, USA', bookings: 15 }
      ];
      
      // Create mock recent bookings
      this.recentBookings = [
        { id: 1001, customerName: 'John Doe', packageName: 'Paris Adventure', status: 'Confirmed' },
        { id: 1002, customerName: 'Jane Smith', packageName: 'Tokyo Explorer', status: 'Pending' },
        { id: 1003, customerName: 'Bob Johnson', packageName: 'New York City Tour', status: 'Cancelled' }
      ];
      
      // Create mock recent reviews
      this.recentReviews = [
        { packageName: 'Paris Adventure', rating: 5, date: new Date(), comment: 'Amazing experience!' },
        { packageName: 'Tokyo Explorer', rating: 4, date: new Date(), comment: 'Great tour, but a bit rushed.' },
        { packageName: 'New York City Tour', rating: 3, date: new Date(), comment: 'Good but expensive.' }
      ];
    }
  }

  configureRevenueChart(): void {
    if (this.stats) {
      // Create mock revenue chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const revenueData = [1000, 1500, 1200, 1800, 2000, 2500];
      
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
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
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
