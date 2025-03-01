import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { countryCodes, CountryCode } from '../../../models/country-codes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  countryCodes = countryCodes;
  selectedCountry: CountryCode = this.countryCodes[0]; // Default to first country

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      countryCode: [this.selectedCountry.dialCode, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onCountryChange(country: CountryCode) {
    this.selectedCountry = country;
    this.loginForm.patchValue({
      countryCode: country.dialCode
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Combine country code and phone number
    const fullPhoneNumber = this.f['countryCode'].value + this.f['phoneNumber'].value;
    const password = this.f['password'].value;

    this.authService.login(fullPhoneNumber, password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }
}
