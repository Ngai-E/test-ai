import { Injectable } from '@angular/core';

export interface PackageType {
  name: string;
  price: number;
  features: string[];
}

export interface TourPackage {
  id: number;
  country: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  packageTypes: PackageType[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  additionalInfo: string[];
}

export interface BookingForm {
  packageId: number;
  packageType: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  numberOfPeople: number;
  specialRequirements: string;
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private packages: TourPackage[] = [
    {
      id: 1,
      country: 'Dubai',
      name: 'Dubai Desert & City Explorer',
      description: 'Experience the perfect blend of modern luxury and traditional Arabian culture in Dubai.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=400',
      duration: '7 Days',
      packageTypes: [
        {
          name: 'Standard',
          price: 1500,
          features: ['3-star hotel accommodation', 'Airport transfers', 'Basic city tour', 'Desert safari']
        },
        {
          name: 'Premium',
          price: 2500,
          features: ['5-star hotel accommodation', 'Private transfers', 'Extended city tour', 'VIP desert safari', 'Burj Khalifa tickets']
        },
        {
          name: 'Luxury',
          price: 3500,
          features: ['Luxury hotel accommodation', 'Private luxury transfers', 'Helicopter tour', 'Private desert safari', 'Fine dining experiences']
        }
      ],
      highlights: [
        'Visit Burj Khalifa - World\'s tallest building',
        'Desert Safari with BBQ dinner',
        'Dubai Mall and Dubai Fountain show',
        'Gold Souk and traditional markets',
        'Dubai Marina cruise'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome',
          activities: [
            'Airport pickup and transfer to hotel',
            'Welcome dinner at traditional Arabic restaurant',
            'Dubai Fountain show viewing'
          ],
          meals: ['Dinner'],
          accommodation: 'Hotel in Downtown Dubai'
        },
        {
          day: 2,
          title: 'Modern Dubai Tour',
          activities: [
            'Visit Burj Khalifa observation deck',
            'Dubai Mall shopping',
            'Dubai Marina walk',
            'Dinner cruise at Dubai Marina'
          ],
          meals: ['Breakfast', 'Dinner'],
          accommodation: 'Hotel in Downtown Dubai'
        },
        {
          day: 3,
          title: 'Desert Adventure',
          activities: [
            'Morning at leisure',
            'Afternoon desert safari',
            'Dune bashing',
            'Camel riding',
            'BBQ dinner with entertainment'
          ],
          meals: ['Breakfast', 'BBQ Dinner'],
          accommodation: 'Hotel in Downtown Dubai'
        }
      ],
      inclusions: [
        'Hotel accommodation',
        'Daily breakfast',
        'Airport transfers',
        'Sightseeing as per itinerary',
        'English speaking guide',
        'All entrance fees',
        'Desert safari with BBQ dinner'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Optional tours',
        'Visa fees'
      ],
      additionalInfo: [
        'Best time to visit: October to April',
        'Visa required for most nationalities',
        'Conservative dress recommended for cultural sites',
        'Friday is a holiday in Dubai'
      ]
    },
    {
      id: 2,
      country: 'Singapore',
      name: 'Singapore Modern City Experience',
      description: 'Discover the perfect blend of nature, culture, and modernity in Singapore.',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&h=400',
      duration: '5 Days',
      packageTypes: [
        {
          name: 'Standard',
          price: 1200,
          features: ['3-star hotel accommodation', 'Public transport pass', 'Basic city tour', 'Gardens by the Bay visit']
        },
        {
          name: 'Premium',
          price: 2000,
          features: ['4-star hotel accommodation', 'Private transfers', 'Universal Studios', 'Night Safari', 'Marina Bay Sands observation deck']
        },
        {
          name: 'Luxury',
          price: 3000,
          features: ['5-star luxury hotel', 'Private luxury transfers', 'Private tours', 'Fine dining experiences', 'Exclusive experiences']
        }
      ],
      highlights: [
        'Gardens by the Bay with Cloud Forest',
        'Universal Studios Singapore',
        'Singapore Night Safari',
        'Marina Bay Sands',
        'Sentosa Island attractions'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Welcome to Singapore',
          activities: [
            'Airport pickup and transfer to hotel',
            'Marina Bay Sands light show',
            'Welcome dinner at Clarke Quay'
          ],
          meals: ['Dinner'],
          accommodation: 'Hotel in Marina Bay'
        },
        {
          day: 2,
          title: 'City Highlights',
          activities: [
            'Gardens by the Bay tour',
            'Marina Bay Sands observation deck',
            'Singapore Flyer experience',
            'Evening at Clarke Quay'
          ],
          meals: ['Breakfast', 'Lunch'],
          accommodation: 'Hotel in Marina Bay'
        },
        {
          day: 3,
          title: 'Nature & Wildlife',
          activities: [
            'Morning at Singapore Zoo',
            'River Safari experience',
            'Night Safari adventure',
            'Local food tasting'
          ],
          meals: ['Breakfast', 'Dinner'],
          accommodation: 'Hotel in Marina Bay'
        }
      ],
      inclusions: [
        'Hotel accommodation',
        'Daily breakfast',
        'Airport transfers',
        'Public transport pass',
        'Entrance fees to attractions',
        'English speaking guide',
        'Welcome dinner'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Optional tours',
        'Additional meals'
      ],
      additionalInfo: [
        'Year-round destination',
        'No visa required for many nationalities',
        'Clean and safe city',
        'Excellent public transportation'
      ]
    }
  ];

  constructor() { }

  getAllPackages(): TourPackage[] {
    return this.packages;
  }

  getPackageById(id: number): TourPackage | undefined {
    return this.packages.find(pkg => pkg.id === id);
  }

  async submitBooking(bookingData: BookingForm): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Booking submitted:', bookingData);
        resolve(true);
      }, 1000);
    });
  }
}
