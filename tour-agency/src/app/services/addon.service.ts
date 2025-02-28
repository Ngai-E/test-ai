import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Addon {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  videoUrl?: string;
  packages: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AddonService {
  private apiUrl = `${environment.apiUrl}/addons`;

  constructor(private http: HttpClient) { }

  getPackageAddons(packageId: number): Observable<Addon[]> {
    return this.http.get<Addon[]>(`${this.apiUrl}/package/${packageId}`);
  }

  getAddonsByCategory(category: string): Observable<Addon[]> {
    return this.http.get<Addon[]>(`${this.apiUrl}/category/${category}`);
  }

  getAddonById(addonId: number): Observable<Addon> {
    return this.http.get<Addon>(`${this.apiUrl}/${addonId}`);
  }
}
