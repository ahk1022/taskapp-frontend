import React, { createContext, useContext, useState } from 'react';

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
          background: '#fff',
          iconBg: '#27ae60',
          borderColor: '#27ae60',
        };
      case 'error':
        return {
          background: '#fff',
          iconBg: '#e74c3c',
          borderColor: '#e74c3c',
        };
      case 'warning':
        return {
          background: '#fff',
          iconBg: '#f39c12',
          borderColor: '#f39c12',
        };
      default:
        return {
          background: '#fff',
          iconBg: '#3498db',
          borderColor: '#3498db',
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
          background: colors.background,
          borderTop: `4px solid ${colors.borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notification-icon-circle" style={{ ...styles.iconCircle, backgroundColor: colors.iconBg }}>
          <span className="notification-icon" style={styles.icon}>{getIcon()}</span>
        </div>
        <h2 className="notification-title" style={{ ...styles.title, color: colors.iconBg }}>{getTitle()}</h2>
        <p className="notification-message" style={styles.message}>{message}</p>
        <button
          className="notification-button"
          style={{
            ...styles.button,
            backgroundColor: colors.iconBg,
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
    backgroundColor: 'rgba(44, 62, 80, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(5px)',
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2.5rem 2rem',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
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
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  },
  icon: {
    fontSize: '3rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  button: {
    color: '#fff',
    border: 'none',
    padding: '0.85rem 3rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
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
          background: '#fff',
          iconBg: '#27ae60',
          borderColor: '#27ae60',
          confirmBg: '#27ae60',
        };
      case 'error':
      case 'danger':
        return {
          background: '#fff',
          iconBg: '#e74c3c',
          borderColor: '#e74c3c',
          confirmBg: '#e74c3c',
        };
      case 'warning':
        return {
          background: '#fff',
          iconBg: '#f39c12',
          borderColor: '#f39c12',
          confirmBg: '#f39c12',
        };
      default:
        return {
          background: '#fff',
          iconBg: '#3498db',
          borderColor: '#3498db',
          confirmBg: '#3498db',
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
          background: colors.background,
          borderTop: `4px solid ${colors.borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notification-icon-circle" style={{ ...styles.iconCircle, backgroundColor: colors.iconBg }}>
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
              backgroundColor: colors.confirmBg,
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
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    border: 'none',
    padding: '0.85rem 2.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  confirmButton: {
    color: '#fff',
    border: 'none',
    padding: '0.85rem 2.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
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
