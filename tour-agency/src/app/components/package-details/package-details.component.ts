import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageService, Package, ItineraryDay as ServiceItineraryDay } from '../../services/package.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItineraryDay } from '../../models/itinerary.model';

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
  itineraryDays: ItineraryDay[] = [];
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
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.loadPackageDetails(Number(packageId));
    }
  }

  loadPackageDetails(id: number): void {
    this.isLoading = true;
    this.packageService.getPackageById(id).subscribe({
      next: (data) => {
        this.package = data;
        
        // Map addons to packageTypes for compatibility with existing HTML
        if (this.package && this.package.addons) {
          this.package.packageTypes = this.package.addons.map(addon => {
            return {
              id: addon.id,
              name: addon.name,
              price: addon.price,
              description: addon.description,
              detailedDescription: addon.detailedDescription,
              accommodationType: addon.category === 'ACCOMMODATION' ? addon.description : undefined,
              transferType: addon.category === 'TRANSPORTATION' ? addon.description : undefined,
              features: [addon.description],
              specialActivities: addon.category === 'ACTIVITY' ? [addon.description] : []
            };
          });
        }
        
        this.parseItinerary();
        console.log('Loaded package details:', this.package);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading package details:', error);
        this.errorMessage = 'Failed to load package details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  parseItinerary(): void {
    if (this.package && this.package.itinerary) {
      // Use the actual itinerary data from the backend
      console.log('Itinerary data (raw):', this.package.itinerary);
      console.log('Itinerary data (JSON):', JSON.stringify(this.package.itinerary, null, 2));
      
      // Make sure we have an array of itinerary days
      if (Array.isArray(this.package.itinerary)) {
        this.itineraryDays = this.package.itinerary.map((day: any) => {
          // Ensure activities is an array
          let activities: string[] = day.activities ? (Array.isArray(day.activities) ? day.activities : (typeof day.activities === 'string' ? (day.activities as string).split(',').map((activity: string) => activity.trim()) : [])) : [];
          
          return {
            dayNumber: day.dayNumber || 0,
            title: day.title || `Day ${day.dayNumber}`,
            description: day.description || '',
            accommodation: day.accommodation || 'Not specified',
            meals: day.meals || 'Not specified',
            activities: activities
          } as ItineraryDay;
        });
        
        // Sort by day number
        this.itineraryDays.sort((a, b) => a.dayNumber - b.dayNumber);
      } else {
        console.error('Itinerary is not an array:', this.package.itinerary);
        this.itineraryDays = [];
      }
    }
  }

  openBookingModal(packageType: any): void {
    this.selectedPackageType = packageType;
    this.modalService.open(this.bookingModal, { centered: true, size: 'lg' });
  }

  submitBooking(): void {
    console.log('Booking submitted:', this.bookingData);
    this.modalService.dismissAll();
    // Here you would typically call a service to submit the booking
  }
}
