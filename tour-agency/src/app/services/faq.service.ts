import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  private apiUrl = `${environment.apiUrl}/faqs`;

  constructor(private http: HttpClient) { }

  /**
   * Get all active FAQs
   */
  getAllFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.apiUrl}`);
  }

  /**
   * Get FAQs by category
   * @param category The category to filter by
   */
  getFAQsByCategory(category: string): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get a single FAQ by ID
   * @param id The ID of the FAQ to retrieve
   */
  getFAQ(id: number): Observable<FAQ> {
    return this.http.get<FAQ>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search FAQs by keyword
   * @param keyword The keyword to search for
   */
  searchFAQs(keyword: string): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.apiUrl}/search?q=${encodeURIComponent(keyword)}`);
  }

  /**
   * Get all available FAQ categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
