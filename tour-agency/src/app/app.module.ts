import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PackagesComponent } from './components/packages/packages.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';

import { SharedModule } from './components/shared/shared.module';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { BookingModule } from './components/booking/booking.module';
import { PackageModule } from './components/package/package.module';

import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
import { BookingService } from './services/booking.service';
import { PackageService } from './services/package.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddonTotalPipe } from './pipes/addon-total.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PackagesComponent,
    WishlistComponent,
    CartComponent,
    AddonTotalPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    AuthModule,
    UserModule,
    BookingModule,
    PackageModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    ToastService,
    BookingService,
    PackageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
