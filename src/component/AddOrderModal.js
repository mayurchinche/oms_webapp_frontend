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
  Grid,
  Autocomplete,
} from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar'; // Keep this import for the Snackbar
import './AddOrderModal.css'; // For custom styles

const AddOrderModal = ({ isModalOpen, closeModal }) => {
  const [customerName, setCustomerName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialCode, setMaterialCode] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isMaterialSelected, setIsMaterialSelected] = useState(false);
  const [isModelSelected, setIsModelSelected] = useState(false);

  const { role, token, mobileNumber, userName } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore modal state
    const savedState = localStorage.getItem('modalState');
    if (savedState) {
      const { 
        isModalOpen, 
        customerName, 
        materialName, 
        materialCode, 
        model, 
        quantity, 
        orderDate 
      } = JSON.parse(savedState);
  
      if (isModalOpen) {
        setCustomerName(customerName);
        setMaterialName(materialName);
        setMaterialCode(materialCode);
        setModel(model);
        setQuantity(quantity);
        setOrderDate(orderDate);
      }
    }
  }, []);
  
  useEffect(() => {
    // Persist modal state
    if (isModalOpen) {
      const stateToPersist = {
        isModalOpen,
        customerName,
        materialName,
        materialCode,
        model,
        quantity,
        orderDate,
      };
      localStorage.setItem('modalState', JSON.stringify(stateToPersist));
    }
  }, [isModalOpen, customerName, materialName, materialCode, model, quantity, orderDate]);
  
  const handleCloseModal = () => {
    closeModal();
    localStorage.removeItem('modalState');
  };
  
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
          const materials = response.data[0].map(material => ({
            name: material.material_name,
            code: material.material_code
          }));
          setMaterials(materials);
        })
        .catch((error) => {
          console.error('Error fetching materials:', error);
        });
    }
  }, [isModalOpen, token, role]);

  const resetModalState = () => {
    setCustomerName('');
    setMaterialName('');
    setMaterialCode('');
    setModel('');
    setQuantity('');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setFilteredCustomers([]);
    setIsCustomerSelected(false);
    setIsMaterialSelected(false);
    setIsModelSelected(false);
    setErrorMessage('');
  };

  const handleCustomerChange = (event, value) => {
    setCustomerName(value);
    setIsCustomerSelected(true);
  };

  const handleMaterialChange = (event, value) => {
    if (value) {
      setMaterialName(value.name);
      setMaterialCode(value.code);
      setIsMaterialSelected(true);

      setLoadingModels(true);
      console.log(`Fetching models for material: ${value.name}`);
      axios.get(`https://ordermanagementservice-backend.onrender.com/api/get/${value.name}`, {
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
    } else {
      setMaterialName('');
      setMaterialCode('');
      setIsMaterialSelected(false);
      setModels([]);
    }
  };

  const handleModelChange = (event, value) => {
    setModel(value);
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
      material_code: materialCode,
      model: model,
      order_date: orderDate,
      order_quantity: quantity,
      ordered_by: userName,
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
              width: 350,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              borderRadius: 2
            }}
          >
            <Typography variant="h5" component="h2" mb={2}>
              Add Order
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <Autocomplete
                  freeSolo
                  disableClearable
                  options={customers}
                  value={customerName}
                  onChange={handleCustomerChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer Name"
                      margin="normal"
                      variant="outlined"
                      onChange={handleCustomerChange}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  disableClearable
                  options={materials}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  value={materialName ? { name: materialName, code: materialCode } : null}
                  onChange={handleMaterialChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Material Name"
                      margin="normal"
                      variant="outlined"
                      onInputChange={(e) => setMaterialName(e.target.value)}
                    />
                  )}
                />
                {loadingModels ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : (
                  <Autocomplete
                    freeSolo
                    disableClearable
                    options={models}
                    value={model}
                    onChange={handleModelChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Model"
                        margin="normal"
                        variant="outlined"
                        onChange={(e) => setModel(e.target.value)}
                      />
                    )}
                    disabled={loadingModels}
                  />
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
// ```

// ### Summary of Improvements:

// 1. **Autocomplete for Selection**: Used `Autocomplete` for customer, material, and model selection to provide a better user experience.
// 2. **Reorganized Layout**: Made the layout more spacious and user-friendly while maintaining essential fields.
// 3. **Error Handling and User Feedback**: Included more user feedback elements such as loading indicators and error messages.
// 4. **Streamlined Backend Interaction**: Optimized backend calls and state management for fetching data.
// 5. **Material-UI Styling**: Enhanced styling using Material-UI components for a modern look.

// Feel free to adapt and test the module. If you have any further refinements or queries, let me know!