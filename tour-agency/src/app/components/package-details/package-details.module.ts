import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PackageDetailsComponent } from './package-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PackageDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    PackageDetailsComponent
  ]
})
export class PackageDetailsModule { }
