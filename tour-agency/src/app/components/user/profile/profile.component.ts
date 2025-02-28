import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User, PasswordChange } from '../../../models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  activeTab = 'profile';
  loading = false;
  successMessage = '';
  errorMessage = '';
  referralInfo: { referralCode: string, referralCount: number, coinsEarned: number } = {
    referralCode: '',
    referralCount: 0,
    coinsEarned: 0
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadReferralInfo();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getUserProfile()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load profile. Please try again.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.profileForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || '',
            zipCode: user.zipCode || ''
          });
        }
      });
  }

  loadReferralInfo(): void {
    this.authService.getReferralInfo()
      .pipe(
        catchError(error => {
          console.error('Failed to load referral info', error);
          return of({
            referralCode: 'N/A',
            referralCount: 0,
            coinsEarned: 0
          });
        })
      )
      .subscribe(info => {
        this.referralInfo = info;
      });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile(this.profileForm.value)
      .pipe(
        catchError(error => {
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const passwordData: PasswordChange = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };

    this.authService.changePassword(passwordData)
      .pipe(
        catchError(error => {
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          this.successMessage = 'Password changed successfully!';
          this.passwordForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }

  passwordMatchValidator(g: FormGroup): { [key: string]: boolean } | null {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  copyReferralCode(): void {
    const el = document.createElement('textarea');
    el.value = this.referralInfo.referralCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    this.successMessage = 'Referral code copied to clipboard!';
    setTimeout(() => this.successMessage = '', 3000);
  }
}
