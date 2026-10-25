import { Station } from '../types/station';

/**
 * Validates whether an email string conforms to a standard email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validates password strength (minimum 6 characters as required by Firebase Auth)
 */
export function isValidPassword(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
}

/**
 * Checks if coordinates are valid WGS84 numbers
 */
export function isValidCoordinate(latitude: unknown, longitude: unknown): boolean {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return false;
  }
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Validates and sanitizes a raw Firestore station document
 */
export function validateStationData(id: string, raw: Record<string, any>): Station | null {
  if (!raw || typeof raw !== 'object') return null;

  const lat = Number(raw.latitude);
  const lng = Number(raw.longitude);

  if (!isValidCoordinate(lat, lng)) {
    console.warn(`[StationValidator] Discarding station ${id} with invalid coordinates:`, {
      latitude: raw.latitude,
      longitude: raw.longitude,
    });
    return null;
  }

  const price = typeof raw.price === 'number' && !isNaN(raw.price) && raw.price >= 0 
    ? raw.price 
    : Number(raw.price) || 0;

  const totalChargers = typeof raw.totalChargers === 'number' && raw.totalChargers >= 0
    ? raw.totalChargers
    : Number(raw.totalChargers) || 1;

  const availableChargers = typeof raw.availableChargers === 'number' && raw.availableChargers >= 0
    ? Math.min(raw.availableChargers, totalChargers)
    : Number(raw.availableChargers) || 0;

  return {
    id,
    name: typeof raw.name === 'string' && raw.name.trim().length > 0 ? raw.name.trim() : 'Unnamed EV Station',
    district: typeof raw.district === 'string' && raw.district.trim().length > 0 ? raw.district.trim() : 'Tamil Nadu',
    address: typeof raw.address === 'string' && raw.address.trim().length > 0 ? raw.address.trim() : 'Address not specified',
    latitude: lat,
    longitude: lng,
    price,
    availableChargers,
    totalChargers,
    chargerType: typeof raw.chargerType === 'string' && raw.chargerType.trim().length > 0 ? raw.chargerType.trim() : 'Type 2 / CCS2',
    ratingAvg: typeof raw.ratingAvg === 'number' ? raw.ratingAvg : Number(raw.ratingAvg) || 0,
    ratingCount: typeof raw.ratingCount === 'number' ? raw.ratingCount : Number(raw.ratingCount) || 0,
  };
}
