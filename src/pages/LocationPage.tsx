import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../hooks/useUserLocation';

export const LocationPage: React.FC = () => {
  const { status, requestLocation, skipLocation, errorMessage } = useUserLocation();
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate();

  const handleEnableLocation = async () => {
    setIsRequesting(true);
    const granted = await requestLocation();
    setIsRequesting(false);
    if (granted) {
      navigate('/map', { replace: true });
    }
  };

  const handleSkip = () => {
    skipLocation();
    navigate('/map', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--main-background)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <img
          src="/logo.png"
          alt="Smart EV Logo"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            objectFit: 'contain',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '16px',
          }}
        />

        {/* Pulsing Location Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-green-light)',
            color: 'var(--primary-green)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 10px 0' }}>
          Enable Device Location
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--secondary-text)',
            lineHeight: 1.5,
            margin: '0 0 24px 0',
          }}
        >
          Smart EV uses your geographical location to identify nearby charging stations, display real-time straight-line distances, and calculate turn-by-turn road routes.
        </p>

        {/* Permission Denied Notice */}
        {status === 'denied' && (
          <div
            className="alert alert-warning"
            role="alert"
            style={{ textAlign: 'left', marginBottom: '20px', fontSize: '13px' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flexShrink: 0, marginTop: '2px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong>Location Access Blocked</strong>
              <p style={{ margin: '4px 0 0 0' }}>
                Your browser or device has denied location permissions. You can still search and browse stations manually on the map.
              </p>
            </div>
          </div>
        )}

        {errorMessage && status !== 'denied' && (
          <div
            className="alert alert-error"
            role="alert"
            style={{ textAlign: 'left', marginBottom: '20px', fontSize: '13px' }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleEnableLocation}
            className="btn btn-primary btn-block"
            disabled={isRequesting}
            style={{ padding: '12px' }}
          >
            {isRequesting ? 'Prompting Geolocation...' : 'Enable Location'}
          </button>

          <button
            onClick={handleSkip}
            className="btn btn-secondary btn-block"
            style={{ padding: '12px' }}
          >
            Continue Without Location
          </button>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: 'var(--disabled-text)',
            marginTop: '20px',
            marginBottom: 0,
          }}
        >
          You can change location permissions at any time from your browser settings or header indicator.
        </p>
      </div>
    </div>
  );
};
