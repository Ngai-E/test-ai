import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';

@NgModule({
  declarations: [
    ProfileComponent,
    BookingsComponent,
    BookingDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ProfileComponent,
    BookingsComponent,
    BookingDetailsComponent
  ]
})
export class UserModule { }
