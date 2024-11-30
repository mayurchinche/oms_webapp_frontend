import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ApproveOrderModal.css'; // For custom styles

const ApproveOrderModal = ({ isModalOpen, closeModal, order }) => {
  const [expectedPrice, setExpectedPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleApproveOrder = () => {
    const approvalData = {
      approved_by: 'vijay', // Hardcoded for now
      expected_price: expectedPrice,
      order_quantity: orderQuantity
    };

    console.log('Approving order:', approvalData);
    setLoading(true);
    axios.put(` https://ordermanagementservice-backend.onrender.com/api/core/orders/approve/${order.order_id}`, approvalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Order approved:', response.data);
        if (response.status === 200) {
          setLoading(false);
          setSuccessMessage('Order successfully approved');
          setTimeout(() => {
            setSuccessMessage('');
            closeModal();
            navigate('/manager-dashboard'); // Redirect to the pending requests page
          }, 2000);
        }
      })
      .catch(error => {
        console.error('Error approving order:', error);
        setLoading(false);
        alert('Failed to approve order');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Approve Order</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Order ID</label>
                    <input type="text" className="form-control" value={order.order_id} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Approved By</label>
                    <input type="text" className="form-control" value="vijay" readOnly />
                  </div>
                  <div className="form-group">
                    <label>Expected Price</label>
                    <input type="number" className="form-control" value={expectedPrice} onChange={(e) => setExpectedPrice(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Order Quantity</label>
                    <input type="number" className="form-control" value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleApproveOrder}>Approve</button>
            </div>
          </div>
        </div>
      </div>
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </>
  );
};

export default ApproveOrderModal;