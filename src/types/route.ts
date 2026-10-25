export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] tuples for Leaflet
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  origin: {
    lat: number;
    lng: number;
    label?: string;
  };
  destination: {
    lat: number;
    lng: number;
    label?: string;
  };
  externalDirectionsUrl: string;
}

export interface RouteState {
  route: RouteResult | null;
  isLoading: boolean;
  error: string | null;
}
