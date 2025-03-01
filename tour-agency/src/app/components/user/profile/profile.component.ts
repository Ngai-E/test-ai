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
  coinBalance = 0;
  referralCode = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getUserProfile()
      .pipe(
        catchError(error => {
          this.loading = false;
          this.errorMessage = 'Failed to load profile. Please try again.';
          console.error('Error loading profile:', error);
          return of(null);
        })
      )
      .subscribe(user => {
        this.loading = false;
        
        if (!user) return;
        
        // Update form with user data
        this.profileForm.patchValue({
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || ''
        });
        
        // Store user data
        this.currentUser = user;
        this.coinBalance = user.coinBalance || 0;
        this.referralCode = user.referralCode || '';
        
        // Load referral stats
        this.loadReferralStats();
      });
  }

  loadReferralStats(): void {
    this.authService.getReferralInfo()
      .pipe(
        catchError(error => {
          console.error('Error loading referral stats:', error);
          return of({
            referralCode: this.referralCode || '',
            referralCount: 0,
            coinsEarned: 0
          });
        })
      )
      .subscribe(stats => {
        this.referralInfo = stats;
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
          if (error.status === 400) {
            this.errorMessage = 'Current password is incorrect. Please try again.';
          } else {
            this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
          }
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
