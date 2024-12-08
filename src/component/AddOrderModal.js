import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Backdrop,
  Modal,
  Fade,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar'; // Import the SuccessSnackbar component
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
      resetModalState();

      console.log('Fetching customers and materials...');
      axios.get('https://ordermanagementservice-backend.onrender.com/api/customers', {
        headers: { Authorization: `Bearer ${token}`, role: role },
      })
        .then((response) => {
          console.log('Customers fetched:', response.data[0]);
          setCustomers(response.data[0].map((customer) => customer.customer_name));
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });

      axios.get('https://ordermanagementservice-backend.onrender.com/api/materials', {
        headers: { Authorization: `Bearer ${token}`, role: role },
      })
        .then((response) => {
          console.log('Materials fetched:', response.data[0]);
          setMaterials(response.data[0].map((material) => material.material_name));
        })
        .catch((error) => {
          console.error('Error fetching materials:', error);
        });
    }
  }, [isModalOpen, token, role]);

  const resetModalState = () => {
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
  };

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setCustomerName(value);
    setIsCustomerSelected(false);
    if (value.length > 0) {
      setFilteredCustomers(customers.filter((customer) => customer.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredCustomers([]);
    }
  };

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setMaterialName(value);
    setIsMaterialSelected(false);
    if (value.length > 0) {
      setFilteredMaterials(materials.filter((material) => material.toLowerCase().includes(value.toLowerCase())));
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
      setErrorMessage('All fields are required and must be selected from the list.');
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
        resetModalState();
      }
    })
    .catch(error => {
      console.error('Error adding order:', error);
      setLoading(false);
      setErrorMessage('Failed to add order. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    });
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h5" component="h2">
              Add Order
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Customer Name"
                  value={customerName}
                  onChange={handleCustomerChange}
                  variant="outlined"
                />
                {customerName.length > 0 && filteredCustomers.length > 0 && (
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {filteredCustomers.map((customer, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          setCustomerName(customer);
                          setFilteredCustomers([]);
                          setIsCustomerSelected(true);
                        }}
                      >
                        {customer}
                      </MenuItem>
                    ))}
                  </Box>
                )}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Material Name"
                  value={materialName}
                  onChange={handleMaterialChange}
                  variant="outlined"
                />
                {materialName.length > 0 && filteredMaterials.length > 0 && (
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {filteredMaterials.map((material, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleMaterialSelect(material)}
                      >
                        {material}
                      </MenuItem>
                    ))}
                  </Box>
                                  )}
                                  {loadingModels ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                      <CircularProgress color="primary" />
                                    </Box>
                                  ) : (
                                    <TextField
                                      fullWidth
                                      margin="normal"
                                      label="Model"
                                      value={model}
                                      onChange={handleModelChange}
                                      variant="outlined"
                                      disabled={loadingModels}
                                    />
                                  )}
                                  {filteredModels.length > 0 && (
                                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                      {filteredModels.map((model, index) => (
                                        <MenuItem
                                          key={index}
                                          onClick={() => handleModelSelect(model)}
                                        >
                                          {model}
                                        </MenuItem>
                                      ))}
                                    </Box>
                                  )}
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    label="Order Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    variant="outlined"
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    type="date"
                                    label="Order Date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                  />
                                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="error" onClick={closeModal}>
                                      Close
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={handleAddOrder}
                                      disabled={!isCustomerSelected || !isMaterialSelected || !isModelSelected}
                                    >
                                      Add Order
                                    </Button>
                                  </Box>
                                </>
                              )}
                            </Box>
                          </Fade>
                        </Modal>
                        <SuccessSnackbar
                          open={!!successMessage}
                          message={successMessage}
                          onClose={() => setSuccessMessage('')}
                        />
                      </>
                    );
                  };
                  
export default AddOrderModal;