import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PackagesComponent } from './components/packages/packages.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthTestComponent } from './components/auth-test/auth-test.component';

import { SharedModule } from './components/shared/shared.module';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { BookingModule } from './components/booking/booking.module';
import { PackageModule } from './components/package/package.module';
import { AdminModule } from './components/admin/admin.module';
import { ContactModule } from './components/contact/contact.module';
import { PackageDetailsModule } from './components/package-details/package-details.module';

import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
import { BookingService } from './services/booking.service';
import { PackageService } from './services/package.service';
import { TestService } from './services/test.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddonTotalPipe } from './pipes/addon-total.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PackagesComponent,
    WishlistComponent,
    CartComponent,
    AuthTestComponent,
    AddonTotalPipe,
    CurrencyPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    AuthModule,
    UserModule,
    BookingModule,
    PackageModule,
    AdminModule,
    ContactModule,
    PackageDetailsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    ToastService,
    BookingService,
    PackageService,
    TestService,
    AddonTotalPipe,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
