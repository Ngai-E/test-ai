import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PackageManagementComponent } from './package-management/package-management.component';
import { BookingManagementComponent } from './booking-management/booking-management.component';
import { ReviewManagementComponent } from './review-management/review-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddonManagementComponent } from './addon-management/addon-management.component';
import { ItineraryManagementComponent } from './itinerary-management/itinerary-management.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'packages', component: PackageManagementComponent },
      { path: 'packages/:id/addons', component: AddonManagementComponent },
      { path: 'packages/:id/itinerary', component: ItineraryManagementComponent },
      { path: 'bookings', component: BookingManagementComponent },
      { path: 'reviews', component: ReviewManagementComponent },
      { path: 'users', component: UserManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
