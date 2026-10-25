export interface Station {
  id: string;
  name: string;
  district: string; // Tamil Nadu District name
  address: string;
  latitude: number;
  longitude: number;
  price: number; // in ₹ per kWh
  availableChargers: number;
  totalChargers: number;
  chargerType: string;
  ratingAvg?: number;
  ratingCount?: number;
  // Computed runtime properties
  distanceKm?: number;
}

export interface StationFilterSortOptions {
  searchQuery: string;
  sortBy: 'nearest' | 'cheapest' | 'default';
  districtFilter?: string;
}
