import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Backdrop,
  Modal,
  Fade,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar';

const RaiseReversalModal = ({ isModalOpen, closeModal, order, forwardOrderColumns, fetchOrders }) => {
  const [reversalQuantity, setReversalQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({}); // Track form validation errors

  const { role, token, mobileNumber } = useSelector((state) => state.auth);

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!reversalQuantity || reversalQuantity <= 0) {
      errors.reversalQuantity = 'Reversal quantity must be greater than 0.';
    } else if (reversalQuantity > order.order_quantity) {
      errors.reversalQuantity = 'Reversal quantity cannot exceed the original quantity.';
    }
    if (!description.trim()) {
      errors.description = 'Description is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleAddReversal = () => {
    if (!validateForm()) {
      return; // Do not proceed if validation fails
    }

    const reversalData = {
      created_at: new Date().toISOString(),
      description: description,
      origin_order_supplier_name: order.supplier_name,
      original_order_id: order.order_id,
      original_order_material_name: order.material_name,
      original_order_quantity: order.order_quantity,
      reversal_quantity: reversalQuantity,
      user_contact_number: mobileNumber,
    };

    setLoading(true);
    axios
      .post(
        'https://ordermanagementservice-backend.onrender.com/api/core/orders/add_reversal_order',
        reversalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setSuccessMessage('Reversal successfully added');
          setTimeout(() => {
            setSuccessMessage('');
            closeModal();
            fetchOrders(
              `https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`,
              forwardOrderColumns
            );
          }, 2000);
        }
      })
      .catch((error) => {
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
              width: 380,
              maxHeight: '80vh',
              overflowY: 'auto',
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
                  error={!!formErrors.reversalQuantity}
                  helperText={formErrors.reversalQuantity}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
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
                    disabled={loading} // Disable button during loading
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
