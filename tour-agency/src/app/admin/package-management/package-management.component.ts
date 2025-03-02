import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';

interface Package {
  id: number;
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  imageUrl?: string;
  highlights?: string;
  inclusions?: string;
  exclusions?: string;
  bestTimeToVisit?: string;
  groupSize?: string;
  featured: boolean;
  available: boolean;
}

interface PackageFilters {
  search: string;
  destination: string;
  status: string;
  featured: string;
}

@Component({
  selector: 'app-package-management',
  templateUrl: './package-management.component.html',
  styleUrls: ['./package-management.component.scss']
})
export class PackageManagementComponent implements OnInit {
  @ViewChild('packageModal') packageModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  packages: Package[] = [];
  filteredPackages: Package[] = [];
  destinations: string[] = [];
  
  loading = true;
  error = false;
  editMode = false;
  
  packageForm!: FormGroup;
  packageToDelete: Package | null = null;
  
  filters: PackageFilters = {
    search: '',
    destination: '',
    status: '',
    featured: ''
  };

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPackages();
  }

  initForm(): void {
    this.packageForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      imageUrl: [''],
      highlights: [''],
      inclusions: [''],
      exclusions: [''],
      bestTimeToVisit: [''],
      groupSize: [''],
      featured: [false],
      available: [true]
    });
  }

  loadPackages(): void {
    this.loading = true;
    this.adminService.getPackages().subscribe(
      (data) => {
        this.packages = data;
        this.filteredPackages = [...this.packages];
        this.extractDestinations();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading packages:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  extractDestinations(): void {
    // Extract unique destinations for the filter dropdown
    const destinationSet = new Set<string>();
    this.packages.forEach(pkg => {
      if (pkg.destination) {
        destinationSet.add(pkg.destination);
      }
    });
    this.destinations = Array.from(destinationSet).sort();
  }

  applyFilters(): void {
    this.filteredPackages = this.packages.filter(pkg => {
      // Search filter (case insensitive)
      const searchMatch = !this.filters.search || 
        pkg.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(this.filters.search.toLowerCase());
      
      // Destination filter
      const destinationMatch = !this.filters.destination || 
        pkg.destination === this.filters.destination;
      
      // Status filter
      const statusMatch = this.filters.status === '' || 
        pkg.available.toString() === this.filters.status;
      
      // Featured filter
      const featuredMatch = this.filters.featured === '' || 
        pkg.featured.toString() === this.filters.featured;
      
      return searchMatch && destinationMatch && statusMatch && featuredMatch;
    });
  }

  openPackageModal(pkg?: Package): void {
    this.editMode = !!pkg;
    
    if (pkg) {
      // Edit mode - populate form with package data
      this.packageForm.patchValue({
        id: pkg.id,
        name: pkg.name,
        destination: pkg.destination,
        duration: pkg.duration,
        price: pkg.price,
        description: pkg.description,
        imageUrl: pkg.imageUrl || '',
        highlights: pkg.highlights || '',
        inclusions: pkg.inclusions || '',
        exclusions: pkg.exclusions || '',
        bestTimeToVisit: pkg.bestTimeToVisit || '',
        groupSize: pkg.groupSize || '',
        featured: pkg.featured,
        available: pkg.available
      });
    } else {
      // Add mode - reset form
      this.packageForm.reset({
        featured: false,
        available: true,
        duration: 1,
        price: 0
      });
    }
    
    this.modalService.open(this.packageModal, { size: 'lg', centered: true });
  }

  confirmDelete(pkg: Package): void {
    this.packageToDelete = pkg;
    this.modalService.open(this.deleteModal, { centered: true });
  }

  savePackage(): void {
    if (this.packageForm.invalid) {
      return;
    }
    
    const packageData = this.packageForm.value;
    
    if (this.editMode) {
      // Update existing package
      this.adminService.updatePackage(packageData.id, packageData).subscribe(
        () => {
          this.toastService.showSuccess('Package updated successfully');
          this.loadPackages();
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Error updating package:', error);
          this.toastService.showError('Failed to update package');
        }
      );
    } else {
      // Create new package
      this.adminService.createPackage(packageData).subscribe(
        () => {
          this.toastService.showSuccess('Package created successfully');
          this.loadPackages();
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Error creating package:', error);
          this.toastService.showError('Failed to create package');
        }
      );
    }
  }

  deletePackage(): void {
    if (!this.packageToDelete) {
      return;
    }
    
    this.adminService.deletePackage(this.packageToDelete.id).subscribe(
      () => {
        this.toastService.showSuccess('Package deleted successfully');
        this.loadPackages();
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error deleting package:', error);
        this.toastService.showError('Failed to delete package');
      }
    );
  }
}
