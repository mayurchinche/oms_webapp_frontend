import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './ManageSupplierModal.css'; // For custom styles

const ManageSupplierModal = ({ isModalOpen, closeModal }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for suppliers
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false); // Add Supplier Modal state
  const [newSupplierName, setNewSupplierName] = useState(''); // State to track new supplier name
  const [newContactNumber, setNewContactNumber] = useState(''); // State to track new contact number
  const [currentSupplier, setCurrentSupplier] = useState({}); // State to track current supplier for update

  const { role, token } = useSelector((state) => state.auth);

  const fetchSuppliers = () => {
    setLoading(true);
    setError(null);
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
        } else {
          setError('No suppliers found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch suppliers');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliers();
    }
  }, [isModalOpen]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name && typeof supplier.supplier_name === 'string' && supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddSupplierModal = () => {
    setIsAddSupplierModalOpen(true);
  };

  const closeAddSupplierModal = () => {
    setIsAddSupplierModalOpen(false);
  };

  const handleAddSupplier = () => {
    const supplierData = {
      contact_number: newContactNumber,
      supplier_name: newSupplierName
    };

    axios.post('https://ordermanagementservice-backend.onrender.com/api/suppliers', supplierData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Supplier added:', response.data);
        alert('Supplier added successfully');
        closeAddSupplierModal();
        fetchSuppliers(); // Refresh the suppliers list
      })
      .catch(err => {
        console.error('Failed to add supplier', err);
        alert('Failed to add supplier');
      });
  };

  const handleDeleteSupplier = (supplierName) => {
    if (window.confirm(`Are you sure you want to delete the supplier ${supplierName}?`)) {
      axios.delete(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${supplierName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Supplier deleted:', response.data);
          alert('Supplier deleted successfully');
          fetchSuppliers(); // Refresh the suppliers list
        })
        .catch(err => {
          console.error('Failed to delete supplier', err);
          alert('Failed to delete supplier');
        });
    }
  };

  const openUpdateSupplierModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsAddSupplierModalOpen(true);
  };

  const handleUpdateSupplier = () => {
    const updatedSupplierData = {
      contact_number: newContactNumber || currentSupplier.contact_number,
      supplier_name: newSupplierName || currentSupplier.supplier_name
    };

    axios.put(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${currentSupplier.supplier_name}`, updatedSupplierData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Supplier updated:', response.data);
        alert('Supplier updated successfully');
        closeAddSupplierModal();
        fetchSuppliers(); // Refresh the suppliers list
      })
      .catch(err => {
        console.error('Failed to update supplier', err);
        alert('Failed to update supplier');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <input
                type="text"
                placeholder="Search Supplier"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="search-button">Search</button>
              <button className="add-supplier-button" onClick={openAddSupplierModal}>Add Supplier</button>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <div className="supplier-list">
                  {filteredSuppliers.map((supplier, index) => (
                    <div key={index} className="supplier-item">
                      <div className="supplier-header">
                        <span>{supplier.supplier_name}</span>
                        <button className="update-button" onClick={() => openUpdateSupplierModal(supplier)}>Update</button>
                        <button className="delete-button" onClick={() => handleDeleteSupplier(supplier.supplier_name)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isAddSupplierModalOpen && (
        <div className="modal-overlay"></div>
      )}
      <div className={`modal ${isAddSupplierModalOpen ? 'show' : ''}`} style={{ display: isAddSupplierModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{currentSupplier.supplier_name ? 'Update Supplier' : 'Add Supplier'}</h5>
              <button type="button" className="close" onClick={closeAddSupplierModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={newContactNumber}
                  onChange={(e) => setNewContactNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeAddSupplierModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={currentSupplier.supplier_name ? handleUpdateSupplier : handleAddSupplier}>
                {currentSupplier.supplier_name ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageSupplierModal;