import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PackageManagementComponent } from './package-management/package-management.component';
import { BookingManagementComponent } from './booking-management/booking-management.component';
import { ReviewManagementComponent } from './review-management/review-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddonManagementComponent } from './addon-management/addon-management.component';
import { ItineraryManagementComponent } from './itinerary-management/itinerary-management.component';
import { PackageEditComponent } from './package-edit/package-edit.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    PackageManagementComponent,
    BookingManagementComponent,
    ReviewManagementComponent,
    UserManagementComponent,
    AddonManagementComponent,
    ItineraryManagementComponent,
    PackageEditComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    RouterModule
  ]
})
export class AdminModule { }
