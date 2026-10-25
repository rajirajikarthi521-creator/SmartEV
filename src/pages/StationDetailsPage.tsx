import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Station } from '../types/station';
import { getStationById } from '../services/stationService';
import { StationDetails } from '../components/stations/StationDetails';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm } from '../utils/distance';

export const StationDetailsPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { coordinates } = useUserLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!stationId) {
        setError('Station ID parameter is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const found = await getStationById(stationId);
        if (found) {
          if (coordinates) {
            found.distanceKm = calculateDistanceKm(
              coordinates.latitude,
              coordinates.longitude,
              found.latitude,
              found.longitude
            );
          }
          setStation(found);
        } else {
          setError('The requested charging station could not be found.');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to retrieve charging station details.');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [stationId, coordinates]);

  return (
    <div
      style={{
        maxWidth: '720px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 16px',
      }}
    >
      {isLoading && <LoadingSpinner label="Loading station specifications..." />}

      {error && !isLoading && (
        <ErrorMessage
          title="Station Not Found"
          message={error}
          onRetry={() => navigate('/stations')}
        />
      )}

      {station && !isLoading && (
        <StationDetails
          station={station}
          onBack={() => navigate('/stations')}
          onViewOnMap={() => navigate('/map')}
          onGetRoute={() => navigate(`/route/${station.id}`)}
        />
      )}
    </div>
  );
};
