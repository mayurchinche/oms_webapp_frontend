import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './AddOrderModal.css'; // For custom styles
 
const AddOrderModal = ({ isModalOpen, closeModal }) => {
  const [customerName, setCustomerName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isMaterialSelected, setIsMaterialSelected] = useState(false);
  const [isModelSelected, setIsModelSelected] = useState(false);
 
  const { role, token, mobileNumber } = useSelector((state) => state.auth);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (isModalOpen) {
      // Reset modal state
      setCustomerName('');
      setMaterialName('');
      setModel('');
      setQuantity('');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setFilteredCustomers([]);
      setFilteredMaterials([]);
      setFilteredModels([]);
      setIsCustomerSelected(false);
      setIsMaterialSelected(false);
      setIsModelSelected(false);
      setErrorMessage('');
 
      console.log('Fetching customers and materials...');
      axios.get('https://ordermanagementservice-backend.onrender.com/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      })
        .then(response => {
          console.log('Customers fetched:', response.data[0]);
          setCustomers(response.data[0].map(customer => customer.customer_name));
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
        });
 
      axios.get('https://ordermanagementservice-backend.onrender.com/api/materials', {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      })
        .then(response => {
          console.log('Materials fetched:', response.data[0]);
          setMaterials(response.data[0].map(material => material.material_name));
        })
        .catch(error => {
          console.error('Error fetching materials:', error);
        });
    }
  }, [isModalOpen, token, role]);
 
  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setCustomerName(value);
    setIsCustomerSelected(false);
    if (value.length > 0) {
      setFilteredCustomers(customers.filter(customer => customer.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredCustomers([]);
    }
  };
 
  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setMaterialName(value);
    setIsMaterialSelected(false);
    if (value.length > 0) {
      setFilteredMaterials(materials.filter(material => material.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredMaterials([]);
    }
  };
 
  const handleMaterialSelect = (material) => {
    setMaterialName(material);
    setFilteredMaterials([]);
    setIsMaterialSelected(true);
    setLoadingModels(true);
    console.log(`Fetching models for material: ${material}`);
    axios.get(`https://ordermanagementservice-backend.onrender.com/api/get/${material}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Models fetched:', response.data[0].modules);
        setModels(Array.isArray(response.data[0].modules) ? response.data[0].modules.map(module => module.module_name) : []);
        setLoadingModels(false);
      })
      .catch(error => {
        console.error('Error fetching models:', error);
        setLoadingModels(false);
      });
  };
 
  const handleModelChange = (e) => {
    const value = e.target.value;
    setModel(value);
    setIsModelSelected(false);
    if (value.length > 0) {
      setFilteredModels(Array.isArray(models) ? models.filter(model => typeof model === 'string' && model.toLowerCase().includes(value.toLowerCase())) : []);
    } else {
      setFilteredModels([]);
    }
  };
 
  const handleModelSelect = (model) => {
    setModel(model);
    setFilteredModels([]);
    setIsModelSelected(true);
  };
 
  const handleAddOrder = () => {
    if (!isCustomerSelected || !isMaterialSelected || !isModelSelected || !quantity || !orderDate) {
      setErrorMessage('All fields are required and must be selected from the list');
      return;
    }
 
    const orderData = {
      customer_name: customerName,
      material_name: materialName,
      model: model,
      order_date: orderDate,
      order_quantity: quantity,
      ordered_by: 'juned', // Hardcoded for now
      user_contact_number: mobileNumber
    };
 
    console.log('Adding order:', orderData);
    setLoading(true);
    axios.post('https://ordermanagementservice-backend.onrender.com/api/core/orders/add_order', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Order added:', response.data);
        if (response.status === 200) {
          setLoading(false);
          setSuccessMessage('Order successfully added');
          setCustomerName('');
          setMaterialName('');
          setModel('');
          setQuantity('');
          setOrderDate(new Date().toISOString().split('T')[0]);
          setIsCustomerSelected(false);
          setIsMaterialSelected(false);
          setIsModelSelected(false);
        }
      })
      .catch(error => {
        console.error('Error adding order:', error);
        setLoading(false);
        setErrorMessage('Failed to add order. Please enter details again.');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
      });
  };
 
  const handleSuccessConfirm = () => {
    setSuccessMessage('');
    closeModal();
    navigate('/employee-dashboard'); // Redirect to the dashboard page
  };
 
  const handleSuccessCancel = () => {
    setSuccessMessage('');
    closeModal();
  };
 
  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg"> {/* Increased width */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Order</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loading-modal">
                  <div className="loading-content">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input type="text" className="form-control" value={customerName} onChange={handleCustomerChange} placeholder="Enter customer name" />
                    {customerName.length > 0 && filteredCustomers.length > 0 && (
                      <ul className="list-group suggestions-list" style={{ marginLeft: '160px', width: 'calc(100% - 160px)' }}>
                        {filteredCustomers.map((customer, index) => (
                          <li key={index} className="list-group-item list-group-item-action" onClick={() => { setCustomerName(customer); setFilteredCustomers([]); setIsCustomerSelected(true); }}>
                            {customer}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Material Name</label>
                    <input type="text" className="form-control" value={materialName} onChange={handleMaterialChange} placeholder="Enter material name" />
                    {materialName.length > 0 && filteredMaterials.length > 0 && (
                      <ul className="list-group suggestions-list" style={{ marginLeft: '160px', width: 'calc(100% - 160px)' }}>
                        {filteredMaterials.map((material, index) => (
                          <li key={index} className="list-group-item list-group-item-action" onClick={() => handleMaterialSelect(material)}>
                            {material}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input type="text" className="form-control" value={model} onChange={handleModelChange} placeholder="Enter model" disabled={loadingModels} />
                    {loadingModels && (
                      <div className="loading-modal">
                        <div className="loading-content">
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          <p>Getting models for selected material...</p>
                        </div>
                      </div>
                    )}
                    {filteredModels.length > 0 && (
                      <ul className="list-group suggestions-list" style={{ marginLeft: '160px', width: 'calc(100% - 160px)' }}>
                        {filteredModels.map((model, index) => (
                          <li key={index} className="list-group-item list-group-item-action" onClick={() => { handleModelSelect(model); setFilteredModels([]); }}>
                            {model}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Order Quantity</label>
                    <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter order quantity" />
                  </div>
                  <div className="form-group">
                    <label>Order Date</label>
                    <input type="date" className="form-control" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                  </div>
                </>
              )}
              <div className="modal-footer" style={{position:'relative'}}>
              <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddOrder} disabled={!isCustomerSelected || !isMaterialSelected || !isModelSelected}>Add Order</button>
            </div>
            </div>
           
          </div>
        </div>
      </div>
      {successMessage && (
        <>
          <div className="modal-overlay blur-background"></div>
          <div className="success-message" style={{backgroundColor:'lightgreen'}}>
            <h5 style={{color:'black'}}>Success</h5>
            <p style={{color:'black'}}>{successMessage}</p>
            <button type="button" className="btn btn-primary" onClick={handleSuccessConfirm}>OK</button>
            <button type="button" className="btn btn-secondary" onClick={handleSuccessCancel}>Cancel</button>
          </div>
        </>
      )}
    </>
  );
};
 
export default AddOrderModal;