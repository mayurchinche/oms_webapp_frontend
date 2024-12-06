import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './RaiseReversalModal.css'; // For custom styles

const RaiseReversalModal = ({ isModalOpen, closeModal, order }) => {
  const [reversalQuantity, setReversalQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { role, token, mobileNumber } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleAddReversal = () => {
    const reversalData = {
      created_at: new Date().toISOString(),
      description: description,
      origin_order_supplier_name: order.supplier_name,
      original_order_id: order.order_id,
      original_order_material_name: order.material_name,
      original_order_quantity: order.order_quantity,
      reversal_quantity: reversalQuantity,
      user_contact_number: mobileNumber
    };

    console.log('Adding reversal:', reversalData);
    setLoading(true);
    axios.post(' https://ordermanagementservice-backend.onrender.com/api/core/orders/add_reversal_order', reversalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Reversal added:', response.data);
        if (response.status === 200) {
          setLoading(false);
          setSuccessMessage('Reversal successfully added');
          setTimeout(() => {
            setSuccessMessage('');
            closeModal();
            navigate('/employee-dashboard'); // Redirect to the dashboard page
          }, 2000);
        }
      })
      .catch(error => {
        console.error('Error adding reversal:', error);
        setLoading(false);
        alert('Failed to add reversal');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div >
              <h5>Raise Reversal</h5>
              <button type="button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Order Created Date</label>
                    <input type="text" className="form-control" value={order.order_date} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Original Supplier Name</label>
                    <input type="text" className="form-control" value={order.supplier_name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Material Name</label>
                    <input type="text" className="form-control" value={order.material_name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Original Quantity</label>
                    <input type="text" className="form-control" value={order.order_quantity} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Reversal Quantity</label>
                    <input type="number" className="form-control" value={reversalQuantity} onChange={(e) => setReversalQuantity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button"  onClick={closeModal}>Close</button>
              <button type="button"  onClick={handleAddReversal}>Add Reversal</button>
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

export default RaiseReversalModal;