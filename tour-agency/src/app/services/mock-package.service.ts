import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Package, PackageType, ItineraryDay } from './package.service';

@Injectable({
  providedIn: 'root'
})
export class MockPackageService {
  private mockPackages: Package[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData(): void {
    this.mockPackages = [
      {
        id: 1,
        name: 'Paris Adventure',
        description: 'Explore the beautiful city of Paris',
        country: 'France',
        image: 'assets/images/paris.jpg',
        overview: 'A comprehensive tour of Paris, the City of Light. Experience the charm, culture, and cuisine of one of the world\'s most visited cities.',
        duration: 5,
        groupSize: '10-15',
        transportation: 'Bus, Metro',
        accommodation: '4-star hotel',
        meals: 'Breakfast included',
        bestTimeToVisit: 'Spring, Fall',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame', 'Seine River Cruise', 'Montmartre'],
        itinerary: 'Day 1: Arrival and Welcome Dinner\nDay 2: Eiffel Tower and Seine River Cruise\nDay 3: Louvre Museum and Tuileries Garden\nDay 4: Montmartre and Sacré-Cœur\nDay 5: Notre Dame and Latin Quarter',
        included: ['Hotel accommodation', 'Breakfast', 'Welcome dinner', 'Tour guide', 'Museum passes', 'Public transportation'],
        excluded: ['Flights', 'Personal expenses', 'Travel insurance', 'Additional meals'],
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
        overview: 'A journey through Rome\'s rich history, from ancient ruins to Renaissance masterpieces and modern Italian culture.',
        duration: 6,
        groupSize: '8-12',
        transportation: 'Walking, Bus',
        accommodation: '3-star hotel',
        meals: 'Breakfast and dinner',
        bestTimeToVisit: 'Spring, Fall',
        highlights: ['Colosseum', 'Vatican', 'Roman Forum', 'Trevi Fountain', 'Spanish Steps'],
        itinerary: 'Day 1: Arrival and Welcome Dinner\nDay 2: Colosseum and Roman Forum\nDay 3: Vatican Museums and St. Peter\'s Basilica\nDay 4: Pantheon and Piazza Navona\nDay 5: Trevi Fountain and Spanish Steps\nDay 6: Free day for shopping and departure',
        included: ['Hotel accommodation', 'Breakfast and dinner', 'Tour guide', 'Skip-the-line tickets', 'Airport transfers'],
        excluded: ['Flights', 'Lunch', 'Personal expenses', 'Travel insurance'],
        basePrice: 1400,
        bookingCount: 38,
        averageRating: 4.5
      },
      {
        id: 3,
        name: 'Tokyo Discovery',
        description: 'Experience the blend of tradition and modernity in Tokyo',
        country: 'Japan',
        image: 'assets/images/tokyo.jpg',
        overview: 'Immerse yourself in the unique culture of Tokyo, where ancient traditions meet futuristic innovations.',
        duration: 7,
        groupSize: '6-10',
        transportation: 'Subway, Train',
        accommodation: '4-star hotel',
        meals: 'Breakfast included',
        bestTimeToVisit: 'Spring (Cherry Blossom), Fall (Autumn Leaves)',
        highlights: ['Meiji Shrine', 'Tokyo Skytree', 'Tsukiji Fish Market', 'Akihabara', 'Mount Fuji Day Trip'],
        itinerary: 'Day 1: Arrival and Welcome Dinner\nDay 2: Meiji Shrine and Harajuku\nDay 3: Tokyo Skytree and Asakusa\nDay 4: Tsukiji Fish Market and Ginza\nDay 5: Akihabara and Ueno Park\nDay 6: Mount Fuji Day Trip\nDay 7: Free day for shopping and departure',
        included: ['Hotel accommodation', 'Breakfast', 'Welcome dinner', 'Tour guide', 'Public transportation pass', 'Mount Fuji excursion'],
        excluded: ['Flights', 'Additional meals', 'Personal expenses', 'Travel insurance'],
        basePrice: 2200,
        bookingCount: 25,
        averageRating: 4.8
      }
    ];
  }

  getAllPackages(): Observable<Package[]> {
    return of(this.mockPackages).pipe(delay(500));
  }

  getPackageById(id: number): Observable<Package> {
    const foundPackage = this.mockPackages.find(pkg => pkg.id === id);
    if (foundPackage) {
      return of(foundPackage).pipe(delay(500));
    }
    return of({
      id: id,
      name: 'Default Package',
      description: 'This is a default package',
      country: 'Unknown',
      image: 'assets/images/default.jpg',
      overview: 'Default overview',
      duration: 5,
      groupSize: '10-15',
      transportation: 'Various',
      accommodation: 'Hotels',
      meals: 'Some meals included',
      bestTimeToVisit: 'All year',
      highlights: ['Highlight 1', 'Highlight 2'],
      itinerary: 'Default itinerary',
      included: ['Item 1', 'Item 2'],
      excluded: ['Item 3', 'Item 4'],
      basePrice: 1000,
      bookingCount: 0,
      averageRating: 0
    }).pipe(delay(500));
  }

  createPackage(tourPackage: Package): Observable<Package> {
    const newPackage = {
      ...tourPackage,
      id: this.mockPackages.length + 1,
      bookingCount: 0,
      averageRating: 0
    };
    this.mockPackages.push(newPackage);
    return of(newPackage).pipe(delay(500));
  }

  updatePackage(id: number, tourPackage: Package): Observable<Package> {
    const index = this.mockPackages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      this.mockPackages[index] = { ...this.mockPackages[index], ...tourPackage };
      return of(this.mockPackages[index]).pipe(delay(500));
    }
    return of(tourPackage).pipe(delay(500));
  }

  deletePackage(id: number): Observable<void> {
    this.mockPackages = this.mockPackages.filter(pkg => pkg.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
