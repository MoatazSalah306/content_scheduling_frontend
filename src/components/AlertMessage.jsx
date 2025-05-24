
import React from 'react';

const AlertMessage = ({ type, message, onClose }) => {
  const getAlertStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '4px',
      color: 'white',
      fontWeight: '500',
      zIndex: 1000,
      maxWidth: '400px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#28a745' };
      case 'error':
        return { ...baseStyle, backgroundColor: '#dc3545' };
      case 'warning':
        return { ...baseStyle, backgroundColor: '#ffc107', color: '#212529' };
      case 'info':
        return { ...baseStyle, backgroundColor: '#17a2b8' };
      default:
        return { ...baseStyle, backgroundColor: '#6c757d' };
    }
  };

  return (
    <div style={getAlertStyle()}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          marginLeft: '10px',
          fontSize: '16px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default AlertMessage;
