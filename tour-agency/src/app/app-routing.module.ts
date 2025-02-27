import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ContactComponent } from './components/contact/contact.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { PackageManagementComponent } from './components/admin/package-management/package-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'packages/:id', component: PackageDetailsComponent },
  { path: 'admin/packages', component: PackageManagementComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
