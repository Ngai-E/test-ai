import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService, ItineraryDay } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-itinerary-management',
  templateUrl: './itinerary-management.component.html',
  styleUrls: ['./itinerary-management.component.scss']
})
export class ItineraryManagementComponent implements OnInit {
  @ViewChild('itineraryModal') itineraryModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  @Input() packageId!: number;
  packageName: string = '';
  
  itineraryDays: ItineraryDay[] = [];
  loading = true;
  error = false;
  editMode = false;
  
  itineraryForm!: FormGroup;
  dayToDelete: ItineraryDay | null = null;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Get packageId from route if not provided as input
    if (!this.packageId) {
      this.route.params.subscribe(params => {
        this.packageId = +params['id'];
        this.loadPackageDetails();
        this.loadItinerary();
      });
    } else {
      this.loadPackageDetails();
      this.loadItinerary();
    }
  }

  initForm(): void {
    this.itineraryForm = this.formBuilder.group({
      id: [null],
      dayNumber: ['', [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      accommodation: [''],
      meals: [''],
      tourPackageId: [this.packageId],
      activities: this.formBuilder.array([this.createActivityControl()])
    });
  }

  createActivityControl(): FormGroup {
    return this.formBuilder.group({
      activity: ['', Validators.required]
    });
  }

  get activitiesArray(): FormArray {
    return this.itineraryForm.get('activities') as FormArray;
  }

  addActivity(): void {
    this.activitiesArray.push(this.createActivityControl());
  }

  removeActivity(index: number): void {
    if (this.activitiesArray.length > 1) {
      this.activitiesArray.removeAt(index);
    }
  }

  loadPackageDetails(): void {
    this.adminService.getPackageById(this.packageId).subscribe(
      (data) => {
        this.packageName = data.name;
      },
      (error) => {
        console.error('Error loading package details:', error);
      }
    );
  }

  loadItinerary(): void {
    this.loading = true;
    this.adminService.getItineraryByPackageId(this.packageId).subscribe(
      (data) => {
        this.itineraryDays = data.sort((a, b) => a.dayNumber - b.dayNumber);
        this.loading = false;
      },
      (error) => {
        console.error('Error loading itinerary:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  openItineraryModal(day?: ItineraryDay): void {
    this.editMode = !!day;
    
    // Clear previous activities
    while (this.activitiesArray.length) {
      this.activitiesArray.removeAt(0);
    }
    
    if (day) {
      // Add activities from the day
      if (day.activities && day.activities.length) {
        day.activities.forEach(activity => {
          this.activitiesArray.push(
            this.formBuilder.group({
              activity: [activity, Validators.required]
            })
          );
        });
      } else {
        // Add at least one empty activity
        this.activitiesArray.push(this.createActivityControl());
      }
      
      this.itineraryForm.patchValue({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        accommodation: day.accommodation,
        meals: day.meals,
        tourPackageId: this.packageId
      });
    } else {
      this.itineraryForm.reset({
        tourPackageId: this.packageId,
        dayNumber: this.itineraryDays.length + 1
      });
      
      // Add one empty activity
      this.activitiesArray.push(this.createActivityControl());
    }
    
    this.modalService.open(this.itineraryModal, { size: 'lg' });
  }

  saveItineraryDay(): void {
    if (this.itineraryForm.invalid) return;
    
    const itineraryData = {...this.itineraryForm.value};
    
    // Extract activities from form array
    itineraryData.activities = itineraryData.activities.map((item: any) => item.activity);
    
    if (this.editMode) {
      this.adminService.updateItineraryDay(this.packageId, itineraryData.id, itineraryData).subscribe(
        () => {
          this.toastService.showSuccess('Itinerary day updated successfully');
          this.modalService.dismissAll();
          this.loadItinerary();
        },
        (error) => {
          console.error('Error updating itinerary day:', error);
          this.toastService.showError('Failed to update itinerary day');
        }
      );
    } else {
      this.adminService.createItineraryDay(this.packageId, itineraryData).subscribe(
        () => {
          this.toastService.showSuccess('Itinerary day created successfully');
          this.modalService.dismissAll();
          this.loadItinerary();
        },
        (error) => {
          console.error('Error creating itinerary day:', error);
          this.toastService.showError('Failed to create itinerary day');
        }
      );
    }
  }

  confirmDelete(day: ItineraryDay): void {
    this.dayToDelete = day;
    this.modalService.open(this.deleteModal);
  }

  deleteItineraryDay(): void {
    if (!this.dayToDelete) return;
    
    this.adminService.deleteItineraryDay(this.packageId, this.dayToDelete.id).subscribe(
      () => {
        this.toastService.showSuccess(`Itinerary day "${this.dayToDelete?.title}" deleted successfully`);
        this.modalService.dismissAll();
        this.loadItinerary();
        this.dayToDelete = null;
      },
      (error) => {
        console.error('Error deleting itinerary day:', error);
        this.toastService.showError('Failed to delete itinerary day');
      }
    );
  }
}
