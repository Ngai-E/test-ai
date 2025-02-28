import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Package } from './package.service';

@Injectable({
  providedIn: 'root'
})
export class MockWishlistService {
  private mockWishlist: Map<number, Package[]> = new Map();

  constructor() {
    // Initialize with some mock data
    this.generateMockData();
  }

  private generateMockData(): void {
    // Create mock packages for wishlist
    const mockPackages: Package[] = [
      {
        id: 1,
        name: 'Paris Adventure',
        description: 'Explore the beautiful city of Paris',
        country: 'France',
        image: 'assets/images/paris.jpg',
        overview: 'A comprehensive tour of Paris',
        duration: 5,
        groupSize: '10-15',
        transportation: 'Bus, Metro',
        accommodation: '4-star hotel',
        meals: 'Breakfast included',
        bestTimeToVisit: 'Spring, Fall',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame'],
        itinerary: 'Detailed day-by-day itinerary',
        included: ['Hotel', 'Breakfast', 'Tour guide'],
        excluded: ['Flights', 'Personal expenses'],
        basePrice: 1200,
        bookingCount: 45,
        averageRating: 4.7
      },
      {
        id: 2,
        name: 'Rome Explorer',
        description: 'Discover the ancient city of Rome',
        country: 'Italy',
        image: 'assets/images/rome.jpg',
        overview: 'A journey through Rome\'s history',
        duration: 6,
        groupSize: '8-12',
        transportation: 'Walking, Bus',
        accommodation: '3-star hotel',
        meals: 'Breakfast and dinner',
        bestTimeToVisit: 'Spring, Fall',
        highlights: ['Colosseum', 'Vatican', 'Roman Forum'],
        itinerary: 'Detailed day-by-day itinerary',
        included: ['Hotel', 'Breakfast and dinner', 'Tour guide'],
        excluded: ['Flights', 'Lunch', 'Personal expenses'],
        basePrice: 1400,
        bookingCount: 38,
        averageRating: 4.5
      }
    ];

    // Add mock packages to user 1's wishlist
    this.mockWishlist.set(1, mockPackages);
  }

  getWishlist(userId: number): Observable<Package[]> {
    return of(this.mockWishlist.get(userId) || []).pipe(delay(500));
  }

  addToWishlist(userId: number, packageId: number): Observable<void> {
    // Simulate adding a package to wishlist
    const userWishlist = this.mockWishlist.get(userId) || [];
    
    // Check if package is already in wishlist
    if (!userWishlist.some(pkg => pkg.id === packageId)) {
      // Create a mock package to add
      const newPackage: Package = {
        id: packageId,
        name: `Package ${packageId}`,
        description: 'Mock package description',
        country: 'Mock Country',
        image: 'assets/images/default.jpg',
        overview: 'Mock overview',
        duration: 7,
        groupSize: '10-15',
        transportation: 'Various',
        accommodation: 'Hotels',
        meals: 'Some meals included',
        bestTimeToVisit: 'All year',
        highlights: ['Highlight 1', 'Highlight 2'],
        itinerary: 'Mock itinerary',
        included: ['Item 1', 'Item 2'],
        excluded: ['Item 3', 'Item 4'],
        basePrice: 1000,
        bookingCount: 0,
        averageRating: 0
      };
      
      userWishlist.push(newPackage);
      this.mockWishlist.set(userId, userWishlist);
    }
    
    return of(undefined).pipe(delay(500));
  }

  removeFromWishlist(userId: number, packageId: number): Observable<void> {
    // Simulate removing a package from wishlist
    const userWishlist = this.mockWishlist.get(userId) || [];
    const updatedWishlist = userWishlist.filter(pkg => pkg.id !== packageId);
    this.mockWishlist.set(userId, updatedWishlist);
    
    return of(undefined).pipe(delay(500));
  }

  isPackageInWishlist(userId: number, packageId: number): Observable<boolean> {
    const userWishlist = this.mockWishlist.get(userId) || [];
    const isInWishlist = userWishlist.some(pkg => pkg.id === packageId);
    
    return of(isInWishlist).pipe(delay(500));
  }
}
