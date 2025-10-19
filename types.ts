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
