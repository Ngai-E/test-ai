import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PackageDetailsComponent } from '../package-details/package-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PackageDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    PackageDetailsComponent
  ]
})
export class PackageModule { }
