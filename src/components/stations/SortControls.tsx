import React from 'react';
import { SortCriteria } from '../../hooks/useStations';
import { useUserLocation } from '../../hooks/useUserLocation';

interface SortControlsProps {
  sortBy: SortCriteria;
  onSortChange: (sort: SortCriteria) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ sortBy, onSortChange }) => {
  const { coordinates } = useUserLocation();
  const hasLocation = Boolean(coordinates);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
      }}
      role="group"
      aria-label="Station sorting options"
    >
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary-text)' }}>
        Sort:
      </span>

      <button
        type="button"
        onClick={() => onSortChange('default')}
        className={`btn btn-sm ${sortBy === 'default' ? 'btn-primary' : 'btn-secondary'}`}
        aria-pressed={sortBy === 'default'}
      >
        Default
      </button>

      <button
        type="button"
        onClick={() => {
          if (hasLocation) {
            onSortChange('nearest');
          }
        }}
        disabled={!hasLocation}
        title={!hasLocation ? 'Enable device location to sort by nearest distance' : 'Sort by nearest distance'}
        className={`btn btn-sm ${sortBy === 'nearest' ? 'btn-primary' : 'btn-secondary'}`}
        aria-pressed={sortBy === 'nearest'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Nearest {!hasLocation && '(GPS required)'}
      </button>

      <button
        type="button"
        onClick={() => onSortChange('cheapest')}
        className={`btn btn-sm ${sortBy === 'cheapest' ? 'btn-primary' : 'btn-secondary'}`}
        aria-pressed={sortBy === 'cheapest'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontWeight: 700 }}>₹</span>
        Cheapest
      </button>
    </div>
  );
};
