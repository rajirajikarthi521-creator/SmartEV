import { useState, useEffect, useMemo, useCallback } from 'react';
import { Station } from '../types/station';
import { getStations, isWithinTamilNadu } from '../services/stationService';
import { calculateDistanceKm } from '../utils/distance';
import { useUserLocation } from './useUserLocation';

export type SortCriteria = 'nearest' | 'cheapest' | 'default';

export function useStations() {
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromFirebase, setIsFromFirebase] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortCriteria>('default');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  const { coordinates } = useUserLocation();

  // Load all Tamil Nadu stations
  const loadStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getStations();
      // Ensure strictly Tamil Nadu stations only
      const tnOnly = result.stations.filter((st) =>
        isWithinTamilNadu(st.latitude, st.longitude)
      );
      setAllStations(tnOnly);
      setIsFromFirebase(result.fromFirebase);
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load Tamil Nadu charging stations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  // Compute live straight-line distance from user's current GPS position
  const stationsWithDistance = useMemo(() => {
    return allStations.map((st) => {
      if (coordinates) {
        const dist = calculateDistanceKm(
          coordinates.latitude,
          coordinates.longitude,
          st.latitude,
          st.longitude
        );
        return { ...st, distanceKm: dist };
      }
      return { ...st, distanceKm: undefined };
    });
  }, [allStations, coordinates]);

  // Filter and sort stations according to user search and Nearest selection
  const filteredAndSortedStations = useMemo(() => {
    let result = [...stationsWithDistance];

    // District filter (if selected)
    if (selectedDistrict && selectedDistrict !== 'All') {
      result = result.filter(
        (st) => st.district.toLowerCase() === selectedDistrict.toLowerCase()
      );
    }

    // Search query filter: matches station name, district, address, or connector
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          st.district.toLowerCase().includes(q) ||
          st.address.toLowerCase().includes(q) ||
          st.chargerType.toLowerCase().includes(q)
      );
    }

    // Sorting & "Nearest" requirement:
    // "When the user selects “Nearest,” display only the stations closest to their current location."
    if (sortBy === 'nearest') {
      // Sort ascending by distance
      result.sort((a, b) => {
        const distA = a.distanceKm !== undefined ? a.distanceKm : Infinity;
        const distB = b.distanceKm !== undefined ? b.distanceKm : Infinity;
        return distA - distB;
      });

      // If user location is active, display only the closest stations
      if (coordinates) {
        const closestStations = result.filter(
          (st) => st.distanceKm !== undefined && st.distanceKm <= 50
        );
        // If some stations are within 50km, display only those; otherwise display the top closest 5 stations
        if (closestStations.length > 0) {
          result = closestStations;
        } else {
          result = result.slice(0, 5);
        }
      }
    } else if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [stationsWithDistance, selectedDistrict, searchQuery, sortBy, coordinates]);

  // When search query is entered and results match, automatically select the top matching station
  // so the user immediately sees the route to it on the map!
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && filteredAndSortedStations.length > 0) {
      setSelectedStationId(filteredAndSortedStations[0].id);
    }
  }, [searchQuery, filteredAndSortedStations]);

  const selectedStation = useMemo(() => {
    if (!selectedStationId) return null;
    return stationsWithDistance.find((s) => s.id === selectedStationId) || null;
  }, [stationsWithDistance, selectedStationId]);

  // List of all unique Tamil Nadu districts available in the dataset
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    allStations.forEach((st) => {
      if (st.district) set.add(st.district);
    });
    return Array.from(set).sort();
  }, [allStations]);

  return {
    stations: filteredAndSortedStations,
    totalTamilNaduStations: allStations.length,
    selectedStation,
    selectedStationId,
    setSelectedStationId,
    isLoading,
    error,
    isFromFirebase,
    searchQuery,
    setSearchQuery,
    selectedDistrict,
    setSelectedDistrict,
    availableDistricts,
    sortBy,
    setSortBy,
    refreshStations: loadStations,
  };
}
