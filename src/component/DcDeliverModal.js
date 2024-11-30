import React, { useState } from 'react';
import './DcDeliverModal.css'; // Import the CSS file

const DcDeliverModal = ({ isModalOpen, closeModal, orderId, dcDeliver }) => {
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = () => {
    dcDeliver(orderId, deliveryDate);
    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>DC Deliver</h2>
        <label>
          Delivery Date:
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit}>DC Deliver</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default DcDeliverModal;