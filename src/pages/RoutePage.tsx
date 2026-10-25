import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Station } from '../types/station';
import { getStationById } from '../services/stationService';
import { useRoute } from '../hooks/useRoute';
import { useUserLocation } from '../hooks/useUserLocation';
import { MapView } from '../components/map/MapView';
import { RoutePanel } from '../components/routing/RoutePanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const RoutePage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoadingStation, setIsLoadingStation] = useState<boolean>(true);
  const [stationError, setStationError] = useState<string | null>(null);

  const { coordinates, requestLocation } = useUserLocation();
  const navigate = useNavigate();

  // Load destination station
  useEffect(() => {
    async function load() {
      if (!stationId) {
        setStationError('Missing station ID.');
        setIsLoadingStation(false);
        return;
      }

      setIsLoadingStation(true);
      setStationError(null);
      try {
        const found = await getStationById(stationId);
        if (found) {
          setStation(found);
        } else {
          setStationError('Destination charging station was not found in the database.');
        }
      } catch (err: any) {
        setStationError(err?.message || 'Error fetching station coordinates.');
      } finally {
        setIsLoadingStation(false);
      }
    }

    load();
  }, [stationId]);

  // Route calculation hook
  const { route, isLoading: isRoutingLoading, error: routeError, recalculateRoute } =
    useRoute(station);

  if (isLoadingStation) {
    return (
      <div style={{ padding: '60px 16px' }}>
        <LoadingSpinner label="Preparing route destination..." />
      </div>
    );
  }

  if (stationError || !station) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px' }}>
        <ErrorMessage
          title="Destination Unavailable"
          message={stationError || 'Unable to load charging station.'}
          onRetry={() => navigate('/map')}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          flexDirection: 'row',
        }}
      >
        {/* Left Side Route Panel */}
        <aside
          style={{
            width: '420px',
            maxWidth: '100%',
            height: '100%',
            backgroundColor: 'var(--white-surface)',
            borderRight: '1px solid var(--border-color)',
            padding: '16px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {/* Missing Location Warning Banner */}
          {!coordinates && (
            <div
              className="alert alert-warning"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <strong>Current Location Required</strong>
              </div>
              <p style={{ margin: 0, fontSize: '13px' }}>
                To calculate a turn-by-turn road route and estimate travel time, Smart EV needs your device coordinates.
              </p>
              <button
                onClick={() => requestLocation()}
                className="btn btn-sm btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: '4px' }}
              >
                Enable Location
              </button>
            </div>
          )}

          <RoutePanel
            station={station}
            route={route}
            isLoading={isRoutingLoading}
            error={routeError}
            onBack={() => navigate('/map')}
            onRetry={recalculateRoute}
          />
        </aside>

        {/* Right Side Map Displaying Route Polyline */}
        <main
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
          }}
        >
          <MapView
            stations={[station]}
            selectedStation={station}
            onSelectStation={() => {}}
            route={route}
          />
        </main>
      </div>
    </div>
  );
};
