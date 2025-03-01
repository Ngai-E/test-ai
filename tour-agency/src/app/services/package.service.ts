import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

export interface PackageType {
  id?: number;
  name: string;
  price: number;
  description: string;
  detailedDescription?: string;
  accommodationType?: string;
  transferType?: string;
  features?: string[];
  specialActivities?: string[];
}

export interface ItineraryDay {
  id?: number;
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string;
  activities: string[];
}

export interface Package {
  id: number;
  name: string;
  description: string;
  country: string;
  image: string;  
  overview: string;
  duration: number;
  groupSize: string;
  transportation: string;
  accommodation: string;
  meals: string;
  bestTimeToVisit: string;
  highlights: string[];
  itinerary: ItineraryDay[];  
  included: string[];
  excluded: string[];
  basePrice: number;
  bookingCount: number;
  averageRating: number;
  packageTypes?: PackageType[];
  addons?: any[];
  reviews?: any[];
  wishlistedBy?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) { }

  getAllPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  getFeaturedPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl}/featured`).pipe(
      catchError(() => {
        return this.getAllPackages().pipe(
          map(packages => packages.slice(0, 4))
        );
      })
    );
  }

  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/${id}`);
  }

  createPackage(tourPackage: Package): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, tourPackage);
  }

  updatePackage(id: number, tourPackage: Package): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${id}`, tourPackage);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
