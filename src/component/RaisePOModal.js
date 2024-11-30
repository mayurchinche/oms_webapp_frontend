import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './RaisePOModal.css'; // For custom styles

const RaisePOModal = ({ isModalOpen, closeModal, orderId, userName }) => {
  const [orderedPrice, setOrderedPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const { role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isModalOpen) {
      axios.get('https://ordermanagementservice-backend.onrender.com/api/suppliers', {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      })
        .then(response => {
          console.log('Suppliers fetched:', response.data[0]);
          if (response.data && response.data[0] && response.data[0].length > 0) {
            setSuppliers(response.data[0]); // Access the inner array and set the suppliers data
          }
        })
        .catch(err => {
          console.error('Failed to fetch suppliers', err);
        });
    }
  }, [isModalOpen, token, role]);

  const handleRaisePO = () => {
    const poData = {
      ordered_price: orderedPrice,
      po_no: orderId,
      po_raised_by: userName,
      supplier_name: supplierName
    };

    axios.post(`https://ordermanagementservice-backend.onrender.com/api/core/orders/raise_po/${orderId}`, poData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('PO raised:', response.data);
        alert('PO raised successfully');
        closeModal();
      })
      .catch(err => {
        console.error('Failed to raise PO', err);
        alert('Failed to raise PO');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Raise PO</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Order Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderedPrice}
                  onChange={(e) => setOrderedPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Supplier Name</label>
                <select
                  className="form-control"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier, index) => (
                    <option key={index} value={supplier.supplier_name}>{supplier.supplier_name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleRaisePO}>Raise PO</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RaisePOModal;