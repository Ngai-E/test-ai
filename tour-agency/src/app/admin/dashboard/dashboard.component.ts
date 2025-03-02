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

  loadDashboardData(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe(
      (data) => {
        this.stats = data;
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

  configureRevenueChart(): void {
    if (this.stats && this.stats.revenueChart) {
      this.revenueChartLabels = this.stats.revenueChart.labels;
      this.revenueChartData = [
        {
          data: this.stats.revenueChart.data,
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

  refresh(): void {
    this.loadDashboardData();
  }
}
