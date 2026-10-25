import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SplashPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/map', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--main-background)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <img
        src="/logo.png"
        alt="Smart EV Logo"
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '18px',
          objectFit: 'contain',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '20px',
        }}
      />

      <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 6px 0' }}>
        Smart EV
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: 'var(--secondary-text)',
          margin: '0 0 28px 0',
        }}
      >
        Find Your Charge. Drive Smarter.
      </p>

      <LoadingSpinner label="Initializing services..." size="md" />
    </div>
  );
};
