import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageService, Package } from '../../services/package.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {
  @ViewChild('bookingModal') bookingModal: any;
  
  package: Package | null = null;
  isLoading = true;
  errorMessage = '';
  selectedPackageType: any;
  bookingData = {
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    numberOfPeople: 1,
    specialRequirements: ''
  };

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadPackageDetails(id);
    });
  }

  loadPackageDetails(id: number): void {
    this.isLoading = true;
    this.packageService.getPackageById(id).subscribe(
      (data) => {
        this.package = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading package details:', error);
        this.errorMessage = 'Failed to load package details. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  openBookingModal(packageType: any) {
    this.selectedPackageType = packageType;
    this.modalService.open(this.bookingModal, { 
      centered: true,
      size: 'lg'
    });
  }

  submitBooking() {
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', {
      packageType: this.selectedPackageType,
      bookingData: this.bookingData
    });
    this.modalService.dismissAll();
    // Reset form
    this.bookingData = {
      fullName: '',
      email: '',
      phone: '',
      travelDate: '',
      numberOfPeople: 1,
      specialRequirements: ''
    };
  }
}
