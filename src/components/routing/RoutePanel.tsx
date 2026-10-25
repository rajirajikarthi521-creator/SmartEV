import React from 'react';
import { RouteResult } from '../../types/route';
import { Station } from '../../types/station';
import { formatDistance, formatDuration } from '../../utils/distance';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RoutePanelProps {
  station: Station;
  route: RouteResult | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  station,
  route,
  isLoading,
  error,
  onBack,
  onRetry,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          className="btn btn-sm btn-secondary"
          style={{ padding: '6px 10px' }}
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
          Back to Map
        </button>

        <span className="badge badge-green">Driving Route</span>
      </div>

      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
          Route to {station.name}
        </h3>
        <p style={{ fontSize: '13px', margin: 0, color: 'var(--secondary-text)' }}>
          {station.address}
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '24px 0' }}>
          <LoadingSpinner label="Calculating road route via OSRM..." size="sm" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="alert alert-error" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <strong>Route Calculation Notice</strong>
          </div>
          <p style={{ margin: 0, fontSize: '13px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button onClick={onRetry} className="btn btn-sm btn-secondary">
              Retry Calculation
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Route metrics summary card */}
      {route && !isLoading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: 'var(--main-background)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Road Distance
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--primary-green)',
                  marginTop: '2px',
                }}
              >
                {formatDistance(route.distanceKm)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Est. Travel Time
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--main-text)',
                  marginTop: '2px',
                }}
              >
                {formatDuration(route.durationMinutes)}
              </div>
            </div>
          </div>

          {/* Waypoints Origin & Destination */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '4px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#1A73E8',
                  marginTop: '4px',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>Origin</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Your Current Location</div>
              </div>
            </div>

            <div
              style={{
                width: '2px',
                height: '16px',
                backgroundColor: 'var(--border-color)',
                marginLeft: '5px',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-green)',
                  marginTop: '4px',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>Destination</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{station.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>
                  {station.address}
                </div>
              </div>
            </div>
          </div>

          {/* External Google Maps Button */}
          <a
            href={route.externalDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-block"
            style={{ marginTop: '4px' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};
