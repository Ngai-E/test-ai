import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

@NgModule({
  declarations: [
    BookingConfirmationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    BookingConfirmationComponent
  ]
})
export class BookingModule { }
