import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PackagesComponent } from './components/packages/packages.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { PackageManagementComponent } from './components/admin/package-management/package-management.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { PackageDetailComponent } from './components/package/package-detail/package-detail.component';
import { BookingListComponent } from './components/booking/booking-list/booking-list.component';
import { BookingConfirmationComponent } from './components/booking/booking-confirmation/booking-confirmation.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BookingsComponent } from './components/user/bookings/bookings.component';
import { BookingDetailsComponent } from './components/user/booking-details/booking-details.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AddonTotalPipe } from './pipes/addon-total.pipe';
import { BookingService } from './services/booking.service';
import { AuthService } from './services/auth.service';
import { WishlistService } from './services/wishlist.service';
import { PackageService } from './services/package.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PackagesComponent,
    PackageDetailsComponent,
    NavbarComponent,
    FooterComponent,
    ContactComponent,
    PackageManagementComponent,
    LoginComponent,
    RegisterComponent,
    WishlistComponent,
    CartComponent,
    PackageDetailComponent,
    BookingListComponent,
    BookingConfirmationComponent,
    ProfileComponent,
    BookingsComponent,
    BookingDetailsComponent,
    AddonTotalPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // Use real services instead of mock services
    BookingService,
    AuthService,
    WishlistService,
    PackageService,
    AddonTotalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
