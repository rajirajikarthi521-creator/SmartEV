import React from 'react';
import { Station } from '../../types/station';
import { StationCard } from './StationCard';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface StationListProps {
  stations: Station[];
  isLoading: boolean;
  selectedStationId?: string | null;
  onSelectStation?: (station: Station) => void;
  onViewDetails?: (stationId: string) => void;
  onGetRoute?: (stationId: string) => void;
  onResetSearch?: () => void;
  searchQuery?: string;
  isUsingFallback?: boolean;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  isLoading,
  selectedStationId,
  onSelectStation,
  onViewDetails,
  onGetRoute,
  onResetSearch,
  searchQuery,
  isUsingFallback,
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: '32px 16px' }}>
        <LoadingSpinner label="Locating charging stations..." />
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <EmptyState
        title="No charging stations found"
        description={
          searchQuery
            ? `No stations matched "${searchQuery}". Try a different spelling or town name.`
            : 'No active EV charging stations available in this region.'
        }
        actionLabel={searchQuery ? 'Clear Search' : 'Refresh'}
        onAction={onResetSearch}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {isUsingFallback && (
        <div
          className="alert alert-warning"
          style={{ padding: '10px 14px', fontSize: '13px', margin: 0 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Demonstration mode: Showing verified reference stations (connect Firebase Web API keys in .env for live cloud records).
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary-text)' }}>
          {stations.length} {stations.length === 1 ? 'Station' : 'Stations'} Found
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {stations.map((st) => (
          <StationCard
            key={st.id}
            station={st}
            isSelected={selectedStationId === st.id}
            onSelect={onSelectStation}
            onViewDetails={onViewDetails}
            onGetRoute={onGetRoute}
          />
        ))}
      </div>
    </div>
  );
};
