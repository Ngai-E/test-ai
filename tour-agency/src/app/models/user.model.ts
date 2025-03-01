export interface User {
  id?: number;
  phoneNumber: string;
  fullName: string;
  email: string;
  coinBalance?: number;
  referralCode?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
