import { RouteResult } from '../types/route';
import { isValidCoordinate } from '../utils/validation';

const DEFAULT_OSRM_URL =
  import.meta.env.VITE_OSRM_ROUTING_URL ||
  'https://router.project-osrm.org/route/v1/driving';

/**
 * Calculates a road-based driving route between origin and destination coordinates using OSRM
 */
export async function calculateRoadRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destinationName?: string
): Promise<RouteResult> {
  // Validate coordinates
  if (!isValidCoordinate(originLat, originLng)) {
    throw new Error('Current user location coordinates are invalid or unavailable.');
  }
  if (!isValidCoordinate(destLat, destLng)) {
    throw new Error('Destination charging station coordinates are invalid.');
  }

  // Prepare external navigation fallback link
  const externalDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;

  // Build OSRM query: OSRM expects coordinates in {longitude},{latitude} format
  const queryUrl = `${DEFAULT_OSRM_URL}/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

    const response = await fetch(queryUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Routing service responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No driving route could be found between your location and this station.');
    }

    const primaryRoute = data.routes[0];
    const distanceMeters = primaryRoute.distance || 0;
    const durationSeconds = primaryRoute.duration || 0;

    // Convert GeoJSON [lng, lat] coordinates into Leaflet [lat, lng] tuples
    const rawCoords: [number, number][] = primaryRoute.geometry.coordinates || [];
    const leafletCoords: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

    return {
      coordinates: leafletCoords,
      distanceMeters,
      distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
      durationSeconds,
      durationMinutes: Math.round(durationSeconds / 60),
      origin: {
        lat: originLat,
        lng: originLng,
        label: 'Your Location',
      },
      destination: {
        lat: destLat,
        lng: destLng,
        label: destinationName || 'Charging Station',
      },
      externalDirectionsUrl,
    };
  } catch (err: any) {
    console.warn('[RoutingService] OSRM query failed, generating direct geometry fallback:', err);
    
    // Straight-line fallback polyline so user still sees the connection
    const straightLineCoords: [number, number][] = [
      [originLat, originLng],
      [destLat, destLng],
    ];

    // Estimate based on straight line distance
    const R = 6371;
    const dLat = ((destLat - originLat) * Math.PI) / 180;
    const dLon = ((destLng - originLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const estDistanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.2 * 10) / 10;
    const estMinutes = Math.round((estDistanceKm / 40) * 60); // approx 40 km/h city average

    return {
      coordinates: straightLineCoords,
      distanceMeters: estDistanceKm * 1000,
      distanceKm: estDistanceKm,
      durationSeconds: estMinutes * 60,
      durationMinutes: estMinutes,
      origin: { lat: originLat, lng: originLng, label: 'Your Location' },
      destination: { lat: destLat, lng: destLng, label: destinationName || 'Charging Station' },
      externalDirectionsUrl,
    };
  }
}
