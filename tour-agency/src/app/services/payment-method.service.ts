import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  processingFee: number;
  processingTime: string;
  requiresRedirect: boolean;
  supportedCurrencies: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private apiUrl = `${environment.apiUrl}/payment-methods`;

  constructor(private http: HttpClient) { }

  /**
   * Get all active payment methods
   */
  getAllPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}`);
  }

  /**
   * Get a single payment method by ID
   * @param id The ID of the payment method to retrieve
   */
  getPaymentMethod(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get payment methods that support a specific currency
   * @param currency The currency code (e.g., USD, EUR)
   */
  getPaymentMethodsByCurrency(currency: string): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/currency/${currency}`);
  }

  /**
   * Get the processing fee for a specific payment method
   * @param paymentMethodId The ID of the payment method
   * @param amount The transaction amount
   */
  getProcessingFee(paymentMethodId: number, amount: number): Observable<{ fee: number, total: number }> {
    return this.http.get<{ fee: number, total: number }>(
      `${this.apiUrl}/${paymentMethodId}/fee?amount=${amount}`
    );
  }
}
