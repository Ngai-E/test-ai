import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';

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

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})
export class PackageEditComponent implements OnInit {
  packageForm!: FormGroup;
  isEditMode = false;
  packageId?: number;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastService: ToastService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.packageId = +id;
        this.loadPackageData(this.packageId);
      }
    });
  }

  initForm(): void {
    this.packageForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', Validators.required],
      country: [''],
      duration: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      basePrice: [0],
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

  loadPackageData(id: number): void {
    this.loading = true;
    this.adminService.getPackage(id).subscribe(
      (pkg) => {
        if (pkg) {
          // Normalize package data to ensure all fields are present
          const normalizedPackage = {
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
            inclusions: pkg.included || pkg.inclusions || '',
            exclusions: pkg.excluded || pkg.exclusions || '',
            bestTimeToVisit: pkg.bestTimeToVisit || '',
            groupSize: pkg.groupSize || '',
            featured: !!pkg.featured,
            available: pkg.available !== false
          };

          this.packageForm.patchValue(normalizedPackage);
        } else {
          this.toastService.showError('Package not found');
          this.router.navigate(['/admin/packages']);
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading package:', error);
        this.toastService.showError('Failed to load package');
        this.loading = false;
        this.router.navigate(['/admin/packages']);
      }
    );
  }

  savePackage(): void {
    this.submitted = true;
    
    if (this.packageForm.invalid) {
      this.toastService.showError('Please fill in all required fields correctly');
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
      // Map to the backend field names
      included: formData.inclusions || '',
      excluded: formData.exclusions || '',
      bestTimeToVisit: formData.bestTimeToVisit || '',
      groupSize: formData.groupSize || '',
      featured: !!formData.featured,
      available: formData.available !== false
    };
    
    this.loading = true;
    
    if (this.isEditMode && this.packageId) {
      // Update existing package
      this.adminService.updatePackage(this.packageId, packageData).subscribe(
        () => {
          this.toastService.showSuccess('Package updated successfully');
          this.loading = false;
          this.router.navigate(['/admin/packages']);
        },
        (error) => {
          console.error('Error updating package:', error);
          this.toastService.showError('Failed to update package');
          this.loading = false;
        }
      );
    } else {
      // Create new package
      this.adminService.createPackage(packageData).subscribe(
        () => {
          this.toastService.showSuccess('Package created successfully');
          this.loading = false;
          this.router.navigate(['/admin/packages']);
        },
        (error) => {
          console.error('Error creating package:', error);
          this.toastService.showError('Failed to create package');
          this.loading = false;
        }
      );
    }
  }

  cancel(): void {
    this.location.back();
  }
}
