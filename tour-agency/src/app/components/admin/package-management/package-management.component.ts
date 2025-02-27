import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PackageService, Package, ItineraryDay } from '../../../services/package.service';

@Component({
  selector: 'app-package-management',
  templateUrl: './package-management.component.html',
  styleUrls: ['./package-management.component.scss']
})
export class PackageManagementComponent implements OnInit {
  packages: Package[] = [];
  packageForm: FormGroup;
  editMode = false;
  currentPackageId: number | null = null;

  constructor(
    private packageService: PackageService,
    private fb: FormBuilder
  ) {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      country: ['', Validators.required],
      image: ['', Validators.required],
      overview: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      groupSize: ['', Validators.required],
      transportation: ['', Validators.required],
      accommodation: ['', Validators.required],
      meals: ['', Validators.required],
      bestTimeToVisit: ['', Validators.required],
      highlights: this.fb.array(['']),
      itinerary: this.fb.array([]),
      included: this.fb.array(['']),
      excluded: this.fb.array(['']),
      packageTypes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPackages();
    this.addPackageType();
  }

  // Form array getters
  get highlights() { return this.packageForm.get('highlights') as FormArray; }
  get itinerary() { return this.packageForm.get('itinerary') as FormArray; }
  get included() { return this.packageForm.get('included') as FormArray; }
  get excluded() { return this.packageForm.get('excluded') as FormArray; }
  get packageTypes() { return this.packageForm.get('packageTypes') as FormArray; }

  // Add/remove form array items
  addHighlight() {
    this.highlights.push(this.fb.control(''));
  }

  removeHighlight(index: number) {
    this.highlights.removeAt(index);
  }

  addIncluded() {
    this.included.push(this.fb.control(''));
  }

  removeIncluded(index: number) {
    this.included.removeAt(index);
  }

  addExcluded() {
    this.excluded.push(this.fb.control(''));
  }

  removeExcluded(index: number) {
    this.excluded.removeAt(index);
  }

  addItineraryDay() {
    const dayForm = this.fb.group({
      dayNumber: [this.itinerary.length + 1, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      accommodation: ['', Validators.required],
      meals: ['', Validators.required],
      activities: this.fb.array([''])
    });
    this.itinerary.push(dayForm);
  }

  removeItineraryDay(index: number) {
    this.itinerary.removeAt(index);
    // Update day numbers
    for (let i = index; i < this.itinerary.length; i++) {
      this.itinerary.at(i).get('dayNumber')?.setValue(i + 1);
    }
  }

  getActivities(dayIndex: number): FormArray {
    return this.itinerary.at(dayIndex).get('activities') as FormArray;
  }

  addActivity(dayIndex: number) {
    const activities = this.getActivities(dayIndex);
    activities.push(this.fb.control(''));
  }

  removeActivity(dayIndex: number, activityIndex: number) {
    const activities = this.getActivities(dayIndex);
    activities.removeAt(activityIndex);
  }

  addPackageType() {
    const packageType = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
    this.packageTypes.push(packageType);
  }

  removePackageType(index: number) {
    this.packageTypes.removeAt(index);
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe(
      packages => this.packages = packages,
      error => console.error('Error loading packages:', error)
    );
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      if (this.editMode && this.currentPackageId) {
        this.packageService.updatePackage(this.currentPackageId, this.packageForm.value)
          .subscribe(
            () => {
              this.loadPackages();
              this.resetForm();
            },
            error => console.error('Error updating package:', error)
          );
      } else {
        this.packageService.createPackage(this.packageForm.value)
          .subscribe(
            () => {
              this.loadPackages();
              this.resetForm();
            },
            error => console.error('Error creating package:', error)
          );
      }
    }
  }

  editPackage(pkg: Package): void {
    this.editMode = true;
    this.currentPackageId = pkg.id!;
    
    // Clear existing arrays
    while (this.highlights.length) this.highlights.removeAt(0);
    while (this.itinerary.length) this.itinerary.removeAt(0);
    while (this.included.length) this.included.removeAt(0);
    while (this.excluded.length) this.excluded.removeAt(0);
    while (this.packageTypes.length) this.packageTypes.removeAt(0);
    
    // Add highlights
    pkg.highlights.forEach(highlight => {
      this.highlights.push(this.fb.control(highlight));
    });
    
    // Add itinerary days
    pkg.itinerary.forEach(day => {
      const dayForm = this.fb.group({
        dayNumber: [day.dayNumber, Validators.required],
        title: [day.title, Validators.required],
        description: [day.description, Validators.required],
        accommodation: [day.accommodation, Validators.required],
        meals: [day.meals, Validators.required],
        activities: this.fb.array([])
      });
      
      // Add activities
      const activities = dayForm.get('activities') as FormArray;
      day.activities.forEach(activity => {
        activities.push(this.fb.control(activity));
      });
      
      this.itinerary.push(dayForm);
    });
    
    // Add included items
    pkg.included.forEach(item => {
      this.included.push(this.fb.control(item));
    });
    
    // Add excluded items
    pkg.excluded.forEach(item => {
      this.excluded.push(this.fb.control(item));
    });
    
    // Add package types
    pkg.packageTypes.forEach(type => {
      this.packageTypes.push(this.fb.group({
        name: [type.name, Validators.required],
        price: [type.price, [Validators.required, Validators.min(0)]],
        description: [type.description]
      }));
    });
    
    // Set main form values
    this.packageForm.patchValue({
      name: pkg.name,
      description: pkg.description,
      country: pkg.country,
      image: pkg.image,
      overview: pkg.overview,
      duration: pkg.duration,
      groupSize: pkg.groupSize,
      transportation: pkg.transportation,
      accommodation: pkg.accommodation,
      meals: pkg.meals,
      bestTimeToVisit: pkg.bestTimeToVisit
    });
  }

  deletePackage(id: number): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.packageService.deletePackage(id).subscribe(
        () => this.loadPackages(),
        error => console.error('Error deleting package:', error)
      );
    }
  }

  resetForm(): void {
    this.packageForm.reset();
    // Clear all form arrays
    while (this.highlights.length) this.highlights.removeAt(0);
    while (this.itinerary.length) this.itinerary.removeAt(0);
    while (this.included.length) this.included.removeAt(0);
    while (this.excluded.length) this.excluded.removeAt(0);
    while (this.packageTypes.length) this.packageTypes.removeAt(0);
    
    // Add initial empty items
    this.highlights.push(this.fb.control(''));
    this.included.push(this.fb.control(''));
    this.excluded.push(this.fb.control(''));
    this.addPackageType();
    
    this.editMode = false;
    this.currentPackageId = null;
  }
}
