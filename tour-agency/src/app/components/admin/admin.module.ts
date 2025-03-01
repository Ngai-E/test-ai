import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PackageManagementComponent } from './package-management/package-management.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PackageManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    PackageManagementComponent
  ]
})
export class AdminModule { }
