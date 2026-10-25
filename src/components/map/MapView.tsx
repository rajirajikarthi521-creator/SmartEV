import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Station } from '../../types/station';
import { RouteResult } from '../../types/route';
import { useUserLocation } from '../../hooks/useUserLocation';
import { formatPrice } from '../../utils/distance';

interface MapViewProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  onGetRoute?: (stationId: string) => void;
  route?: RouteResult | null;
  centerCoordinates?: { lat: number; lng: number };
}

export const MapView: React.FC<MapViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onGetRoute,
  route,
  centerCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const stationMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeOutlineRef = useRef<L.Polyline | null>(null);

  const [tileErrorNotice, setTileErrorNotice] = useState<string | null>(null);
  const { coordinates } = useUserLocation();

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default center (Tirunelveli, Tamil Nadu, matching Android base data)
    const initialLat = centerCoordinates?.lat || coordinates?.latitude || 8.7139;
    const initialLng = centerCoordinates?.lng || coordinates?.longitude || 77.7567;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    const tileUrl =
      import.meta.env.VITE_OSM_TILE_URL ||
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution =
      import.meta.env.VITE_OSM_ATTRIBUTION ||
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    });

    tileLayer.on('tileerror', () => {
      setTileErrorNotice(
        'Map tiles are taking longer to load. Station details and routing remain fully active.'
      );
    });

    tileLayer.addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (coordinates) {
      const userLatLng: L.LatLngTuple = [coordinates.latitude, coordinates.longitude];

      const userIcon = L.divIcon({
        className: 'user-gps-container',
        html: '<div class="user-gps-marker"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(userLatLng, {
          icon: userIcon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup('<strong>Your Location</strong>');
      } else {
        userMarkerRef.current.setLatLng(userLatLng);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [coordinates]);

  // Update Station Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current.clear();

    const createEvIcon = (isSelected: boolean) =>
      L.divIcon({
        className: 'ev-icon-wrapper',
        html: `<div class="ev-map-pin ${isSelected ? 'active' : ''}"><div class="ev-map-pin-inner">⚡</div></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32],
      });

    stations.forEach((st) => {
      const isSelected = selectedStation?.id === st.id;
      const marker = L.marker([st.latitude, st.longitude], {
        icon: createEvIcon(isSelected),
        zIndexOffset: isSelected ? 500 : 100,
      }).addTo(map);

      // Station popup
      const popupHtml = `
        <div style="font-family: inherit; min-width: 180px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #202124;">${st.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #5F6368; line-height: 1.3;">${st.address}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 700; color: #0F9D58; font-size: 13px;">${formatPrice(st.price)}</span>
            <span style="font-size: 11px; color: #5F6368;">${st.availableChargers}/${st.totalChargers} Available</span>
          </div>
          <button id="popup-route-btn-${st.id}" style="width: 100%; padding: 5px 8px; background: #0F9D58; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Get Route
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectStation(st);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-route-btn-${st.id}`);
        if (btn && onGetRoute) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onGetRoute(st.id);
          };
        }
      });

      stationMarkersRef.current.set(st.id, marker);
    });
  }, [stations, selectedStation, onSelectStation, onGetRoute]);

  // Recenter when selectedStation changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedStation) return;

    map.panTo([selectedStation.latitude, selectedStation.longitude], {
      animate: true,
      duration: 0.6,
    });

    const marker = stationMarkersRef.current.get(selectedStation.id);
    if (marker && !marker.isPopupOpen()) {
      marker.openPopup();
    }
  }, [selectedStation]);

  // Center when centerCoordinates changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !centerCoordinates) return;
    map.setView([centerCoordinates.lat, centerCoordinates.lng], 13, { animate: true });
  }, [centerCoordinates]);

  // Fit Tamil Nadu stations bounds when stations load without selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedStation || route || stations.length === 0) return;
    const bounds = L.latLngBounds(stations.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
  }, [stations.length, selectedStation, route]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (route && route.coordinates.length > 0) {
      if (routeOutlineRef.current) routeOutlineRef.current.remove();
      if (routePolylineRef.current) routePolylineRef.current.remove();

      // Background contrast casing
      routeOutlineRef.current = L.polyline(route.coordinates, {
        color: '#087443',
        weight: 8,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Foreground route line
      routePolylineRef.current = L.polyline(route.coordinates, {
        color: '#0F9D58',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Auto fit bounds to enclose full route
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      if (routeOutlineRef.current) {
        routeOutlineRef.current.remove();
        routeOutlineRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    }
  }, [route]);

  // Center to user GPS
  const handleRecenter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], 14, { animate: true });
    } else if (stations.length > 0) {
      const bounds = L.latLngBounds(stations.map((s) => [s.latitude, s.longitude]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [coordinates, stations]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Control: Recenter / My Location Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '16px',
          zIndex: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          onClick={handleRecenter}
          className="btn btn-secondary"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            padding: 0,
            boxShadow: 'var(--shadow-md)',
            backgroundColor: 'var(--white-surface)',
          }}
          title={coordinates ? 'Center on My Location' : 'Fit all stations'}
          aria-label="Center map"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary-green)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 2 12 6" />
            <polygon points="12 18 12 22" />
            <polygon points="2 12 6 12" />
            <polygon points="18 12 22 12" />
          </svg>
        </button>
      </div>

      {/* Non-blocking Tile Notification */}
      {tileErrorNotice && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 400,
            backgroundColor: 'rgba(32, 33, 36, 0.88)',
            color: '#FFFFFF',
            fontSize: '12px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {tileErrorNotice}
        </div>
      )}
    </div>
  );
};
