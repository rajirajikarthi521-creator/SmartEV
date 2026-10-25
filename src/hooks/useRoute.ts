import { useState, useEffect, useCallback } from 'react';
import { RouteResult } from '../types/route';
import { Station } from '../types/station';
import { calculateRoadRoute } from '../services/routingService';
import { useUserLocation } from './useUserLocation';

export function useRoute(destinationStation: Station | null) {
  const { coordinates } = useUserLocation();
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(async () => {
    if (!destinationStation) {
      setRoute(null);
      setError(null);
      return;
    }

    if (!coordinates) {
      setError(
        'Your current location is needed to calculate the driving route. Please enable location permissions.'
      );
      setRoute(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await calculateRoadRoute(
        coordinates.latitude,
        coordinates.longitude,
        destinationStation.latitude,
        destinationStation.longitude,
        destinationStation.name
      );
      setRoute(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to calculate driving route.');
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, destinationStation]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  return {
    route,
    isLoading,
    error,
    recalculateRoute: fetchRoute,
  };
}
