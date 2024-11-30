import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './MarkDeliverModal.css'; // For custom styles

const MarkDeliverModal = ({ isModalOpen, closeModal, orderId }) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const { role, token } = useSelector((state) => state.auth);

  const handleMarkDeliver = () => {
    if (!deliveryDate || !receivedQuantity) {
      setResponseMessage('Please enter both delivery date and received quantity.');
      return;
    }

    const deliveryData = {
      delivery_date: deliveryDate,
      received_quantity: parseInt(receivedQuantity, 10) // Convert to integer
    };

    console.log('Sending delivery data:', deliveryData);

    axios.put(`https://ordermanagementservice-backend.onrender.com/api/core/orders/delivery/${orderId}`, deliveryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Delivery marked:', response.data);
        setResponseMessage('Delivery marked successfully');
        setTimeout(() => {
          closeModal();
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to mark delivery', err);
        setResponseMessage('Failed to mark delivery');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Mark as Deliver</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Received Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={receivedQuantity}
                  onChange={(e) => setReceivedQuantity(e.target.value)}
                />
              </div>
              {responseMessage && <div className="response-message">{responseMessage}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleMarkDeliver}>Mark as Deliver</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkDeliverModal;