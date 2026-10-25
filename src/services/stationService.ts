import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  Firestore,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Station } from '../types/station';
import { TAMIL_NADU_STATIONS } from '../data/tamilNaduStations';
import { validateStationData } from '../utils/validation';

/**
 * Validates that coordinates fall within the geographical boundaries of Tamil Nadu, India.
 * Latitude roughly between 8.0° N and 13.6° N, Longitude between 76.1° E and 80.5° E.
 */
export function isWithinTamilNadu(latitude: number, longitude: number): boolean {
  return latitude >= 8.0 && latitude <= 13.6 && longitude >= 76.1 && longitude <= 80.5;
}

/**
 * Seed all verified Tamil Nadu EV charging stations across all districts into Cloud Firestore
 */
export async function seedTamilNaduStationsToFirebase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isFirebaseConfigured || !db) {
    return { success: false, count: 0, error: 'Firebase is not configured. Add live credentials in .env' };
  }

  const firestore = db as Firestore;

  try {
    let count = 0;
    for (const station of TAMIL_NADU_STATIONS) {
      const stationRef = doc(firestore, 'stations', station.id);
      await setDoc(stationRef, {
        name: station.name,
        district: station.district,
        address: station.address,
        latitude: station.latitude,
        longitude: station.longitude,
        price: station.price,
        availableChargers: station.availableChargers,
        totalChargers: station.totalChargers,
        chargerType: station.chargerType,
        ratingAvg: station.ratingAvg || 4.5,
        ratingCount: station.ratingCount || 20,
      });
      count++;
    }
    console.info(`[StationService] Successfully seeded ${count} Tamil Nadu stations into Firestore.`);
    return { success: true, count };
  } catch (err: any) {
    console.error('[StationService] Seeding stations to Firebase failed:', err);
    return { success: false, count: 0, error: err?.message };
  }
}

/**
 * Fetch all charging stations from Cloud Firestore (or verified Tamil Nadu dataset fallback)
 * Exclusively returns stations located within Tamil Nadu.
 */
export async function getStations(): Promise<{ stations: Station[]; fromFirebase: boolean; error?: string }> {
  // If Firebase is configured with real credentials, try loading from Firestore
  if (isFirebaseConfigured && db) {
    const firestore = db as Firestore;
    try {
      const stationsCol = collection(firestore, 'stations');
      const q = query(stationsCol);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const firestoreStations: Station[] = [];
        snapshot.forEach((docSnap) => {
          const raw = docSnap.data();
          const validated = validateStationData(docSnap.id, raw);
          if (validated && isWithinTamilNadu(validated.latitude, validated.longitude)) {
            // Keep district tag if present
            validated.district = (raw.district as string) || 'Tamil Nadu';
            firestoreStations.push(validated);
          }
        });

        if (firestoreStations.length > 0) {
          return { stations: firestoreStations, fromFirebase: true };
        }
      }

      // If Firestore collection is empty, automatically seed with Tamil Nadu stations!
      console.info('[StationService] Firestore collection empty. Seeding all Tamil Nadu stations to Firestore...');
      await seedTamilNaduStationsToFirebase();
      return { stations: TAMIL_NADU_STATIONS, fromFirebase: true };
    } catch (err: any) {
      console.warn('[StationService] Firestore read failed, using verified Tamil Nadu dataset:', err);
      return {
        stations: TAMIL_NADU_STATIONS,
        fromFirebase: false,
        error: err?.message || 'Loaded local verified Tamil Nadu stations.',
      };
    }
  }

  // Resilient verified Tamil Nadu dataset for all districts
  return { stations: TAMIL_NADU_STATIONS, fromFirebase: false };
}

/**
 * Fetch single station by its ID
 */
export async function getStationById(stationId: string): Promise<Station | null> {
  if (!stationId) return null;

  if (isFirebaseConfigured && db) {
    const firestore = db as Firestore;
    try {
      const docRef = doc(firestore, 'stations', stationId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const validated = validateStationData(snapshot.id, snapshot.data());
        if (validated && isWithinTamilNadu(validated.latitude, validated.longitude)) {
          return validated;
        }
      }
    } catch (err) {
      console.warn(`[StationService] Firestore fetch for ${stationId} failed:`, err);
    }
  }

  const found = TAMIL_NADU_STATIONS.find((s) => s.id === stationId);
  return found || null;
}
