import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService, Addon } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addon-management',
  templateUrl: './addon-management.component.html',
  styleUrls: ['./addon-management.component.scss']
})
export class AddonManagementComponent implements OnInit {
  @ViewChild('addonModal') addonModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  @Input() packageId!: number;
  packageName: string = '';
  
  addons: Addon[] = [];
  loading = true;
  error = false;
  editMode = false;
  
  addonForm!: FormGroup;
  addonToDelete: Addon | null = null;
  
  categories = [
    'Transportation',
    'Accommodation',
    'Meals',
    'Activities',
    'Guides',
    'Equipment',
    'Insurance',
    'Other'
  ];

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
        this.loadAddons();
      });
    } else {
      this.loadPackageDetails();
      this.loadAddons();
    }
  }

  initForm(): void {
    this.addonForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      detailedDescription: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      videoUrl: [''],
      category: ['', Validators.required],
      tourPackageId: [this.packageId]
    });
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

  loadAddons(): void {
    this.loading = true;
    this.adminService.getAddonsByPackageId(this.packageId).subscribe(
      (data) => {
        this.addons = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading addons:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  openAddonModal(addon?: Addon): void {
    this.editMode = !!addon;
    
    if (addon) {
      this.addonForm.patchValue({
        id: addon.id,
        name: addon.name,
        description: addon.description,
        detailedDescription: addon.detailedDescription,
        price: addon.price,
        imageUrl: addon.imageUrl,
        videoUrl: addon.videoUrl,
        category: addon.category,
        tourPackageId: this.packageId
      });
    } else {
      this.addonForm.reset({
        tourPackageId: this.packageId
      });
    }
    
    this.modalService.open(this.addonModal, { size: 'lg' });
  }

  saveAddon(): void {
    if (this.addonForm.invalid) return;
    
    const addonData = this.addonForm.value;
    
    if (this.editMode) {
      this.adminService.updateAddon(this.packageId, addonData.id, addonData).subscribe(
        () => {
          this.toastService.showSuccess('Addon updated successfully');
          this.modalService.dismissAll();
          this.loadAddons();
        },
        (error) => {
          console.error('Error updating addon:', error);
          this.toastService.showError('Failed to update addon');
        }
      );
    } else {
      this.adminService.createAddon(this.packageId, addonData).subscribe(
        () => {
          this.toastService.showSuccess('Addon created successfully');
          this.modalService.dismissAll();
          this.loadAddons();
        },
        (error) => {
          console.error('Error creating addon:', error);
          this.toastService.showError('Failed to create addon');
        }
      );
    }
  }

  confirmDelete(addon: Addon): void {
    this.addonToDelete = addon;
    this.modalService.open(this.deleteModal);
  }

  deleteAddon(): void {
    if (!this.addonToDelete) return;
    
    this.adminService.deleteAddon(this.packageId, this.addonToDelete.id).subscribe(
      () => {
        this.toastService.showSuccess(`Addon "${this.addonToDelete?.name}" deleted successfully`);
        this.modalService.dismissAll();
        this.loadAddons();
        this.addonToDelete = null;
      },
      (error) => {
        console.error('Error deleting addon:', error);
        this.toastService.showError('Failed to delete addon');
      }
    );
  }
}
