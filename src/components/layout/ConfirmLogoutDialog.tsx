import React from 'react';

interface ConfirmLogoutDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmLogoutDialog: React.FC<ConfirmLogoutDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal)' as any,
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="card"
        style={{
          maxWidth: '380px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 id="logout-dialog-title" style={{ margin: 0, fontSize: '18px' }}>
          Sign Out of Smart EV?
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--secondary-text)' }}>
          Are you sure you want to log out? You will need to enter your credentials to access saved stations and routing.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          <button onClick={onCancel} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger btn-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
