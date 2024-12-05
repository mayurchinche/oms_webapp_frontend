import React from 'react';
import './InfoBox.css'; // Ensure a separate CSS file for unique styling

const InfoBox = ({ onSwitch }) => {
  return (
    <div className="info-box-container">
      <h3 className="info-box-title">Order Details:</h3>
      <div className="info-box-buttons">
        <button
          className="info-box-button"
          onClick={() => onSwitch('Forward Orders')}
        >
          Forward Orders
        </button>
        <button
          className="info-box-button"
          onClick={() => onSwitch('Reversal Orders')}
        >
          Reversal Orders
        </button>
      </div>
    </div>
  );
};

export default InfoBox;
