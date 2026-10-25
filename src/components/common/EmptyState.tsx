import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No charging stations found',
  description = 'Try adjusting your search terms or clearing filters to locate nearby stations.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '36px 20px',
        backgroundColor: 'var(--white-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--main-background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--secondary-text)',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
          <path d="M2 20h20" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <h3 style={{ fontSize: '18px', color: 'var(--main-text)', margin: 0 }}>
        {title}
      </h3>
      <p style={{ maxWidth: '320px', margin: 0, fontSize: '14px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-sm btn-outline"
          style={{ marginTop: '8px' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
