import React, { createContext, useContext, useState } from 'react';
import theme from '../theme';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const useConfirm = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useConfirm must be used within NotificationProvider');
  }
  return context.confirm;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const success = (message) => showNotification(message, 'success');
  const error = (message) => showNotification(message, 'error');
  const info = (message) => showNotification(message, 'info');
  const warning = (message) => showNotification(message, 'warning');

  const confirm = (message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        title: options.title || 'Confirm Action',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        },
      });
    });
  };

  return (
    <NotificationContext.Provider value={{ success, error, info, warning, confirm }}>
      {children}
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          title={confirmDialog.title}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </NotificationContext.Provider>
  );
};

const NotificationModal = ({ message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
      case 'warning':
        return 'Warning!';
      default:
        return 'Information';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: theme.colors.success,
          borderColor: theme.colors.success,
          lightBg: theme.colors.successBg,
        };
      case 'error':
        return {
          iconBg: theme.colors.danger,
          borderColor: theme.colors.danger,
          lightBg: theme.colors.dangerBg,
        };
      case 'warning':
        return {
          iconBg: theme.colors.warning,
          borderColor: theme.colors.warning,
          lightBg: theme.colors.warningBg,
        };
      default:
        return {
          iconBg: theme.colors.primary,
          borderColor: theme.colors.primary,
          lightBg: theme.colors.primaryBg,
        };
    }
  };

  const colors = getColors();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        className="notification-modal"
        style={{
          ...styles.modal,
          borderTop: `4px solid ${colors.borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="notification-icon-circle"
          style={{
            ...styles.iconCircle,
            backgroundColor: colors.iconBg,
            boxShadow: `0 6px 20px ${colors.iconBg}40`,
          }}
        >
          <span className="notification-icon" style={styles.icon}>{getIcon()}</span>
        </div>
        <h2 className="notification-title" style={{ ...styles.title, color: colors.iconBg }}>{getTitle()}</h2>
        <p className="notification-message" style={styles.message}>{message}</p>
        <button
          className="notification-button"
          style={{
            ...styles.button,
            background: `linear-gradient(135deg, ${colors.iconBg} 0%, ${colors.iconBg}dd 100%)`,
            boxShadow: `0 4px 15px ${colors.iconBg}40`,
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 58, 95, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(5px)',
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: '2.5rem 2rem',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: theme.shadows.lg,
    animation: 'slideUp 0.4s ease',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  iconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '3rem',
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: theme.colors.textSecondary,
    marginBottom: '2rem',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  button: {
    color: theme.colors.white,
    border: 'none',
    padding: '0.85rem 3rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
};

const ConfirmDialog = ({ message, title, confirmText, cancelText, type, onConfirm, onCancel }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
      case 'danger':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return '?';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: theme.colors.success,
          borderColor: theme.colors.success,
          confirmBg: theme.colors.success,
        };
      case 'error':
      case 'danger':
        return {
          iconBg: theme.colors.danger,
          borderColor: theme.colors.danger,
          confirmBg: theme.colors.danger,
        };
      case 'warning':
        return {
          iconBg: theme.colors.warning,
          borderColor: theme.colors.warning,
          confirmBg: theme.colors.warning,
        };
      default:
        return {
          iconBg: theme.colors.primary,
          borderColor: theme.colors.primary,
          confirmBg: theme.colors.primary,
        };
    }
  };

  const colors = getColors();

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div
        className="confirm-dialog notification-modal"
        style={{
          ...styles.modal,
          borderTop: `4px solid ${colors.borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="notification-icon-circle"
          style={{
            ...styles.iconCircle,
            backgroundColor: colors.iconBg,
            boxShadow: `0 6px 20px ${colors.iconBg}40`,
          }}
        >
          <span className="notification-icon" style={styles.icon}>{getIcon()}</span>
        </div>
        <h2 className="notification-title" style={{ ...styles.title, color: colors.iconBg }}>{title}</h2>
        <p className="notification-message" style={styles.message}>{message}</p>
        <div className="confirm-button-group" style={confirmStyles.buttonGroup}>
          <button
            className="confirm-button"
            style={confirmStyles.cancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="confirm-button"
            style={{
              ...confirmStyles.confirmButton,
              background: `linear-gradient(135deg, ${colors.confirmBg} 0%, ${colors.confirmBg}dd 100%)`,
              boxShadow: `0 4px 15px ${colors.confirmBg}40`,
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const confirmStyles = {
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  cancelButton: {
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    border: `2px solid ${theme.colors.border}`,
    padding: '0.85rem 2.5rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  confirmButton: {
    color: theme.colors.white,
    border: 'none',
    padding: '0.85rem 2.5rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
};

// Add CSS animations and mobile responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  /* Mobile responsive styles for notifications */
  @media (max-width: 575.98px) {
    .notification-modal, .confirm-dialog {
      width: 95% !important;
      padding: 1.5rem 1rem !important;
      max-width: 95% !important;
    }

    .notification-icon-circle {
      width: 70px !important;
      height: 70px !important;
    }

    .notification-icon {
      font-size: 2.5rem !important;
    }

    .notification-title {
      font-size: 1.3rem !important;
    }

    .notification-message {
      font-size: 0.95rem !important;
    }

    .notification-button, .confirm-button {
      padding: 0.75rem 2rem !important;
      font-size: 0.95rem !important;
    }

    .confirm-button-group {
      flex-direction: column;
      gap: 0.75rem !important;
    }

    .confirm-button-group button {
      width: 100%;
    }
  }
`;
document.head.appendChild(styleSheet);

export default NotificationModal;
