export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  referenceNumber: string;
}
