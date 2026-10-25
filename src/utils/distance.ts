/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Format distance in km or meters
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm) || !isFinite(distanceKm)) {
    return 'Distance unavailable';
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Format price in Indian Rupees per kWh
 */
export function formatPrice(price?: number): string {
  if (price === undefined || isNaN(price)) {
    return '₹--/kWh';
  }
  return `₹${price.toFixed(1)}/kWh`;
}

/**
 * Format duration in minutes / hours
 */
export function formatDuration(durationMinutes: number): string {
  if (durationMinutes === undefined || isNaN(durationMinutes)) {
    return '-- mins';
  }
  if (durationMinutes < 60) {
    return `${Math.round(durationMinutes)} mins`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const remainingMins = Math.round(durationMinutes % 60);
  return `${hours} hr ${remainingMins} mins`;
}
