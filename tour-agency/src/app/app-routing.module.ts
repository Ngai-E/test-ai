import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ContactComponent } from './components/contact/contact.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { PackageManagementComponent } from './components/admin/package-management/package-management.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { BookingConfirmationComponent } from './components/booking/booking-confirmation/booking-confirmation.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BookingsComponent } from './components/user/bookings/bookings.component';
import { BookingDetailsComponent } from './components/user/booking-details/booking-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'packages/:id', component: PackageDetailsComponent },
  { path: 'admin/packages', component: PackageManagementComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'bookings/:id', component: BookingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'booking-confirmation/:id', component: BookingConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
