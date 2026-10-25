import React from 'react';
import { Station } from '../../types/station';
import { formatDistance, formatPrice } from '../../utils/distance';

interface StationCardProps {
  station: Station;
  isSelected?: boolean;
  onSelect?: (station: Station) => void;
  onViewDetails?: (stationId: string) => void;
  onGetRoute?: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected = false,
  onSelect,
  onViewDetails,
  onGetRoute,
}) => {
  const isAvailable = station.availableChargers > 0;

  return (
    <div
      className="card"
      onClick={() => onSelect && onSelect(station)}
      style={{
        padding: '16px',
        border: `1px solid ${isSelected ? 'var(--primary-green)' : 'var(--border-color)'}`,
        backgroundColor: isSelected ? '#F4FAF6' : 'var(--white-surface)',
        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(station);
        }
      }}
      aria-pressed={isSelected}
    >
      {/* Header: Name and Price */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--main-text)',
              margin: '0 0 4px 0',
              lineHeight: 1.3,
            }}
          >
            {station.name}
          </h4>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--secondary-text)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {station.address}
          </p>
        </div>

        {/* Price Tag */}
        <div
          style={{
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--primary-green)',
            }}
          >
            {formatPrice(station.price)}
          </div>
          {station.distanceKm !== undefined && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--secondary-text)',
                marginTop: '2px',
              }}
            >
              {formatDistance(station.distanceKm)}
            </div>
          )}
        </div>
      </div>

      {/* Meta Badges: Charger Type and Availability */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '4px',
        }}
      >
        <span className="badge badge-gray" style={{ fontWeight: 600, color: 'var(--main-text)' }}>
          📍 {station.district}
        </span>

        <span className="badge badge-gray">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {station.chargerType}
        </span>

        <span className={`badge ${isAvailable ? 'badge-green' : 'badge-orange'}`}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isAvailable ? 'var(--success-color)' : '#D93025',
              display: 'inline-block',
            }}
          />
          {station.availableChargers}/{station.totalChargers} Available
        </span>

        {station.ratingAvg !== undefined && station.ratingAvg > 0 && (
          <span className="badge badge-gray" style={{ color: '#F2994A' }}>
            ★ {station.ratingAvg.toFixed(1)} ({station.ratingCount || 0})
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: '6px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {onViewDetails && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(station.id);
            }}
            className="btn btn-sm btn-secondary"
          >
            Details
          </button>
        )}
        {onGetRoute && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGetRoute(station.id);
            }}
            className="btn btn-sm btn-primary"
          >
            Get Route
          </button>
        )}
      </div>
    </div>
  );
};
