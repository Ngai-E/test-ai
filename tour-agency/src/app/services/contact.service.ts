import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) { }

  /**
   * Submit a contact form
   * @param submission The contact submission data
   */
  submitContactForm(submission: ContactSubmission): Observable<ContactSubmission> {
    return this.http.post<ContactSubmission>(`${this.apiUrl}`, submission);
  }

  /**
   * Get the status of a contact submission
   * @param submissionId The ID of the submission to check
   */
  getSubmissionStatus(submissionId: number): Observable<{ status: string, lastUpdated: string }> {
    return this.http.get<{ status: string, lastUpdated: string }>(
      `${this.apiUrl}/${submissionId}/status`
    );
  }

  /**
   * Get all contact submissions for the current user
   */
  getUserSubmissions(): Observable<ContactSubmission[]> {
    return this.http.get<ContactSubmission[]>(`${this.apiUrl}/user`);
  }
}
