import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type LocationPermissionState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'skipped';

interface LocationContextType {
  coordinates: UserCoordinates | null;
  status: LocationPermissionState;
  errorMessage: string | null;
  requestLocation: () => Promise<boolean>;
  skipLocation: () => void;
  hasAskedPermission: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_PREF_KEY = 'smart_ev_location_pref';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);
  const [status, setStatus] = useState<LocationPermissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState<boolean>(() => {
    return localStorage.getItem(LOCATION_PREF_KEY) === 'skipped';
  });

  const requestLocation = useCallback(async (): Promise<boolean> => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      setErrorMessage('Geolocation is not supported by your browser.');
      return false;
    }

    setStatus('requesting');
    setErrorMessage(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: UserCoordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setCoordinates(coords);
          setStatus('granted');
          setHasAskedPermission(true);
          localStorage.setItem(LOCATION_PREF_KEY, 'granted');
          resolve(true);
        },
        (err) => {
          console.warn('[LocationContext] Geolocation error:', err);
          let msg = 'Failed to retrieve your current location.';
          if (err.code === err.PERMISSION_DENIED) {
            setStatus('denied');
            msg = 'Location permission was denied. You can still browse and search stations manually.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setStatus('unavailable');
            msg = 'Location information is currently unavailable.';
          } else if (err.code === err.TIMEOUT) {
            setStatus('unavailable');
            msg = 'Location request timed out. Please try again.';
          }
          setErrorMessage(msg);
          setHasAskedPermission(true);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const skipLocation = useCallback(() => {
    setStatus('skipped');
    setHasAskedPermission(true);
    localStorage.setItem(LOCATION_PREF_KEY, 'skipped');
  }, []);

  // Try checking permissions API on mount if available
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            requestLocation();
          }
        })
        .catch(() => {
          // Permissions API query not supported for geolocation in some browsers
        });
    }
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        status,
        errorMessage,
        requestLocation,
        skipLocation,
        hasAskedPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useUserLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within a LocationProvider');
  }
  return context;
}
