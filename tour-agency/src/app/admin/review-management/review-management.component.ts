import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';

interface AdminReview {
  id: number;
  packageId: number;
  packageName: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  status: string;
}

interface ReviewFilters {
  search: string;
  packageId: string;
  rating: string;
  status: string;
}

@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.scss']
})
export class ReviewManagementComponent implements OnInit {
  @ViewChild('reviewDetailsModal') reviewDetailsModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  reviews: AdminReview[] = [];
  filteredReviews: AdminReview[] = [];
  packages: any[] = [];
  
  loading = true;
  error = false;
  
  selectedReview: AdminReview | null = null;
  reviewToDelete: AdminReview | null = null;
  
  filters: ReviewFilters = {
    search: '',
    packageId: '',
    rating: '',
    status: ''
  };

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadReviews();
    this.loadPackages();
  }

  loadReviews(): void {
    this.loading = true;
    this.adminService.getAllReviews().subscribe(
      (data) => {
        this.reviews = data;
        this.filteredReviews = [...this.reviews];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading reviews:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  loadPackages(): void {
    this.adminService.getPackages().subscribe(
      (data) => {
        this.packages = data;
      },
      (error) => {
        console.error('Error loading packages:', error);
      }
    );
  }

  refreshReviews(): void {
    this.loadReviews();
  }

  applyFilters(): void {
    this.filteredReviews = this.reviews.filter(review => {
      // Search filter (case insensitive)
      const searchMatch = !this.filters.search || 
        review.userName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        review.packageName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        review.comment.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        review.id.toString().includes(this.filters.search);
      
      // Package filter
      const packageMatch = !this.filters.packageId || 
        review.packageId.toString() === this.filters.packageId;
      
      // Rating filter
      const ratingMatch = !this.filters.rating || 
        review.rating.toString() === this.filters.rating;
      
      // Status filter
      const statusMatch = !this.filters.status || 
        review.status === this.filters.status;
      
      return searchMatch && packageMatch && ratingMatch && statusMatch;
    });
  }

  viewReviewDetails(review: AdminReview): void {
    this.selectedReview = review;
    this.modalService.open(this.reviewDetailsModal, { size: 'lg', centered: true });
  }

  approveReview(review: AdminReview): void {
    this.adminService.approveReview(review.id).subscribe(
      () => {
        review.status = 'Approved';
        this.toastService.showSuccess(`Review #${review.id} has been approved`);
      },
      (error) => {
        console.error('Error approving review:', error);
        this.toastService.showError('Failed to approve review');
      }
    );
  }

  rejectReview(review: AdminReview): void {
    this.adminService.rejectReview(review.id).subscribe(
      () => {
        review.status = 'Rejected';
        this.toastService.showSuccess(`Review #${review.id} has been rejected`);
      },
      (error) => {
        console.error('Error rejecting review:', error);
        this.toastService.showError('Failed to reject review');
      }
    );
  }

  confirmDelete(review: AdminReview): void {
    this.reviewToDelete = review;
    this.modalService.open(this.deleteModal, { centered: true });
  }

  deleteReview(): void {
    if (!this.reviewToDelete) {
      return;
    }
    
    this.adminService.deleteReview(this.reviewToDelete.id).subscribe(
      () => {
        const index = this.reviews.findIndex(r => r.id === this.reviewToDelete!.id);
        if (index !== -1) {
          this.reviews.splice(index, 1);
          this.applyFilters(); // Reapply filters to update the filtered list
          this.toastService.showSuccess(`Review #${this.reviewToDelete!.id} deleted successfully`);
          this.modalService.dismissAll();
        }
      },
      (error) => {
        console.error('Error deleting review:', error);
        this.toastService.showError('Failed to delete review');
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
