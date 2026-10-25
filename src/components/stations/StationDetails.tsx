import React from 'react';
import { Station } from '../../types/station';
import { formatDistance, formatPrice } from '../../utils/distance';

interface StationDetailsProps {
  station: Station;
  onBack: () => void;
  onViewOnMap: () => void;
  onGetRoute: () => void;
}

export const StationDetails: React.FC<StationDetailsProps> = ({
  station,
  onBack,
  onViewOnMap,
  onGetRoute,
}) => {
  const isAvailable = station.availableChargers > 0;

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Top back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onBack}
          className="btn btn-sm btn-secondary"
          style={{ padding: '6px 10px' }}
          aria-label="Back to stations"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <span style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>
          Station Details
        </span>
      </div>

      {/* Station Name & Price */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--main-text)',
              margin: '0 0 6px 0',
            }}
          >
            {station.name}
          </h2>
          <div
            style={{
              backgroundColor: 'var(--primary-green-light)',
              color: 'var(--dark-green)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '18px',
              whiteSpace: 'nowrap',
            }}
          >
            {formatPrice(station.price)}
          </div>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--secondary-text)',
            margin: '6px 0 0 0',
            lineHeight: 1.5,
          }}
        >
          {station.address}
        </p>
      </div>

      {/* Meta Specifications Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          backgroundColor: 'var(--main-background)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
            District (Tamil Nadu)
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
            📍 {station.district}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
            Connector Type
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
            {station.chargerType}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
            Availability
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isAvailable ? 'var(--success-color)' : '#D93025',
              marginTop: '2px',
            }}
          >
            {station.availableChargers} / {station.totalChargers} Available
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
            Distance
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
            {formatDistance(station.distanceKm)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
            Rating
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#F2994A', marginTop: '2px' }}>
            ★ {station.ratingAvg ? station.ratingAvg.toFixed(1) : '4.5'} ({station.ratingCount || 0} reviews)
          </div>
        </div>
      </div>

      {/* Coordinates information */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--secondary-text)',
          display: 'flex',
          gap: '16px',
        }}
      >
        <span>Latitude: {station.latitude.toFixed(5)}</span>
        <span>Longitude: {station.longitude.toFixed(5)}</span>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
        }}
      >
        <button onClick={onViewOnMap} className="btn btn-secondary" style={{ flex: 1 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          View on Map
        </button>

        <button onClick={onGetRoute} className="btn btn-primary" style={{ flex: 1 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          Get Route
        </button>
      </div>
    </div>
  );
};
