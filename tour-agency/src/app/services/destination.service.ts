import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Destination {
  id: number;
  name: string;
  description: string;
  country: string;
  city: string;
  imageUrl: string;
  rating: number;
  popularityScore: number;
  featuredPackages?: number[];
  attractions?: string[];
  bestTimeToVisit?: string;
  climate?: string;
  travelTips?: string[];
}

export interface DestinationFilter {
  country?: string;
  rating?: number;
  featured?: boolean;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = `${environment.apiUrl}/destinations`;

  constructor(private http: HttpClient) { }

  /**
   * Get all destinations
   */
  getAllDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}`);
  }

  /**
   * Get a single destination by ID
   * @param id The ID of the destination to retrieve
   */
  getDestination(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get featured destinations
   * @param limit Optional limit on the number of destinations to return
   */
  getFeaturedDestinations(limit?: number): Observable<Destination[]> {
    const url = limit 
      ? `${this.apiUrl}/featured?limit=${limit}` 
      : `${this.apiUrl}/featured`;
    return this.http.get<Destination[]>(url);
  }

  /**
   * Get destinations by country
   * @param country The country to filter by
   */
  getDestinationsByCountry(country: string): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/country/${encodeURIComponent(country)}`);
  }

  /**
   * Search destinations by keyword
   * @param keyword The keyword to search for
   */
  searchDestinations(keyword: string): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/search?q=${encodeURIComponent(keyword)}`);
  }

  /**
   * Get destinations with filters
   * @param filters The filters to apply
   */
  getFilteredDestinations(filters: DestinationFilter): Observable<Destination[]> {
    // Convert filters to query parameters
    const params = new URLSearchParams();
    
    if (filters.country) {
      params.append('country', filters.country);
    }
    
    if (filters.rating) {
      params.append('minRating', filters.rating.toString());
    }
    
    if (filters.featured !== undefined) {
      params.append('featured', filters.featured.toString());
    }
    
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/filter?${queryString}` : `${this.apiUrl}`;
    
    return this.http.get<Destination[]>(url);
  }

  /**
   * Get all available countries
   */
  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/countries`);
  }
}
