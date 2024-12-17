import React, { useState } from 'react';
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
  Typography,
  Box,
  Alert
} from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar'; // Import the SuccessSnackbar component

const RaiseReversalModal = ({ isModalOpen, closeModal, order,forwardOrderColumns,fetchOrders }) => {
  const [reversalQuantity, setReversalQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    axios.post('https://ordermanagementservice-backend.onrender.com/api/core/orders/add_reversal_order', reversalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
    .then(response => {
      console.log('Reversal added:', response.data);
      if (response.status === 200) {
        setLoading(false);        setSuccessMessage('Reversal successfully added');
        setTimeout(() => {
          setSuccessMessage('');
          closeModal();
          fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`, forwardOrderColumns);// Redirect to the dashboard page
        }, 2000);
      }
    })
    .catch(error => {
      console.error('Error adding reversal:', error);
      setLoading(false);
      setErrorMessage('Failed to add reversal');
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
              Raise Reversal
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
                  label="Order Created Date"
                  value={order.order_date}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Original Supplier Name"
                  value={order.supplier_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Material Name"
                  value={order.material_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Original Quantity"
                  value={order.order_quantity}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="Reversal Quantity"
                  value={reversalQuantity}
                  onChange={(e) => setReversalQuantity(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" color="error" onClick={closeModal}>
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddReversal}
                  >
                    Add Reversal
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

export default RaiseReversalModal;