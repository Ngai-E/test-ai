import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { countryCodes, CountryCode } from '../../../models/country-codes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  countryCodes = countryCodes;
  selectedCountry: CountryCode = this.countryCodes[0]; // Default to first country

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      countryCode: [this.selectedCountry.dialCode, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      referralCode: ['']
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onCountryChange(country: CountryCode) {
    this.selectedCountry = country;
    this.registerForm.patchValue({
      countryCode: country.dialCode
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Combine country code and phone number
    const fullPhoneNumber = this.f['countryCode'].value + this.f['phoneNumber'].value;

    const user: User = {
      id: 0, // Will be assigned by the server
      username: fullPhoneNumber, // Use phoneNumber as username
      email: this.f['email'].value,
      firstName: this.f['fullName'].value.split(' ')[0],
      lastName: this.f['fullName'].value.split(' ').slice(1).join(' '),
      phone: fullPhoneNumber,
      referralCode: this.f['referralCode'].value || undefined
    };

    const password = this.f['password'].value;

    this.authService.register(user, password)
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        error: error => {
          this.error = error.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
