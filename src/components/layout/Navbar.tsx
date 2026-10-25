import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { useUserLocation } from '../../hooks/useUserLocation';

export const Navbar: React.FC = () => {
  const { status, coordinates } = useUserLocation();

  const isLocationActive = status === 'granted' && coordinates !== null;

  return (
    <header
      style={{
        backgroundColor: 'var(--white-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Title */}
        <NavLink
          to="/map"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/logo.png"
            alt="Smart EV Logo"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              objectFit: 'contain',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--main-text)',
                lineHeight: 1.1,
              }}
            >
              Smart EV
            </div>
            <div
              className="hide-on-mobile"
              style={{
                fontSize: '11px',
                color: 'var(--secondary-text)',
                fontWeight: 500,
              }}
            >
              Find Your Charge. Drive Smarter.
            </div>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <NavLink
            to="/map"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? 'var(--primary-green)' : 'var(--secondary-text)',
              backgroundColor: isActive ? 'var(--primary-green-light)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            })}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span>Map</span>
          </NavLink>

          <NavLink
            to="/stations"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? 'var(--primary-green)' : 'var(--secondary-text)',
              backgroundColor: isActive ? 'var(--primary-green-light)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            })}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Stations</span>
          </NavLink>

          {/* Location status badge */}
          <NavLink
            to="/location"
            title={
              isLocationActive
                ? 'GPS Location active'
                : 'Click to enable device location'
            }
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              color: isLocationActive ? 'var(--success-color)' : 'var(--secondary-text)',
              backgroundColor: isLocationActive ? 'var(--success-bg)' : '#F1F3F4',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={isLocationActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="hide-on-mobile">
              {isLocationActive ? 'GPS On' : 'GPS Off'}
            </span>
          </NavLink>

          {/* User Profile Menu */}
          <div style={{ marginLeft: '6px' }}>
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
};
