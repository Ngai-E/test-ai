import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
