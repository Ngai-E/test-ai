import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

interface Package {
  id: number;
  name: string;
  destination?: string;
  country?: string;
  duration: number;
  price?: number;
  basePrice?: number;
  description: string;
  imageUrl?: string;
  image?: string;
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
    private toastService: ToastService,
    private router: Router
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
      country: [''],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      basePrice: [''],
      description: ['', Validators.required],
      imageUrl: [''],
      image: [''],
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
        // Normalize package data to ensure all fields are present
        this.packages = data.map(pkg => ({
          ...pkg,
          // Ensure both field naming conventions are present
          price: pkg.price || pkg.basePrice || 0,
          basePrice: pkg.basePrice || pkg.price || 0,
          destination: pkg.destination || pkg.country || '',
          country: pkg.country || pkg.destination || '',
          image: pkg.image || pkg.imageUrl || '',
          imageUrl: pkg.imageUrl || pkg.image || '',
          // Ensure other fields have default values
          highlights: pkg.highlights || '',
          inclusions: pkg.inclusions || '',
          exclusions: pkg.exclusions || '',
          bestTimeToVisit: pkg.bestTimeToVisit || '',
          groupSize: pkg.groupSize || '',
          featured: !!pkg.featured,
          available: pkg.available !== false
        }));
        this.filteredPackages = [...this.packages];
        this.extractDestinations();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading packages:', error);
        this.toastService.showError('Failed to load packages');
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
        pkg.destination?.toLowerCase().includes(this.filters.search.toLowerCase()) ||
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
    if (pkg) {
      // Edit mode - navigate to edit page
      this.router.navigate(['/admin/packages', pkg.id, 'edit']);
    } else {
      // Add mode - navigate to new package page
      this.router.navigate(['/admin/packages/new']);
    }
  }

  confirmDelete(pkg: Package): void {
    this.packageToDelete = pkg;
    this.modalService.open(this.deleteModal, { centered: true });
  }

  savePackage(): void {
    if (this.packageForm.invalid) {
      return;
    }
    
    const formData = this.packageForm.value;
    
    // Create a new object with both old and new field names for compatibility
    const packageData = {
      ...formData,
      // Ensure both field naming conventions are present
      price: formData.price || 0,
      basePrice: formData.basePrice || formData.price || 0,
      destination: formData.destination || '',
      country: formData.country || formData.destination || '',
      image: formData.image || '',
      imageUrl: formData.imageUrl || formData.image || '',
      // Include all other fields
      highlights: formData.highlights || '',
      inclusions: formData.inclusions || '',
      exclusions: formData.exclusions || '',
      bestTimeToVisit: formData.bestTimeToVisit || '',
      groupSize: formData.groupSize || '',
      featured: !!formData.featured,
      available: formData.available !== false
    };
    
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
