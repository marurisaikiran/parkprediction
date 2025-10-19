
// FIX: Removed a circular import declaration for ParkingLot that conflicted with the interface declaration below.
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  distance: string;
  availability: number; // Percentage of spots available
  pricePerHour: number;
  lat: number;
  lng: number;
}

export interface Booking {
  id: number;
  lotName: string;
  date: string;
  duration: string;
  cost: number;
}

// FIX: Add a shared 'Page' type to be used across the application for navigation state.
export type Page = 'home' | 'profile' | 'settings';
