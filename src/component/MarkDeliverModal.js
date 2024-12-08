import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SuccessSnackbar from './SuccessSnackbar';

const MarkDeliverModal = ({ isModalOpen, closeModal, order }) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const { role, token } = useSelector((state) => state.auth);
  const orderId = order?.order_id; // Handle possible `undefined`

  useEffect(() => {
    if (isModalOpen && order) {
      // Set initial values when the modal opens
      const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      setDeliveryDate(currentDate);
      setReceivedQuantity(order.pending_quantity || '');
      setSnackbarMessage('');
    }
  }, [isModalOpen, order]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMarkDeliver = () => {
    if (!deliveryDate || !receivedQuantity) {
      setSnackbarMessage('Please enter both delivery date and received quantity.');
      setSnackbarOpen(true);
      return;
    }

    const deliveryData = {
      delivery_date: deliveryDate,
      received_quantity: parseInt(receivedQuantity, 10), // Convert to integer
    };

    axios
      .put(
        `https://ordermanagementservice-backend.onrender.com/api/core/orders/delivery/${orderId}`,
        deliveryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setSnackbarMessage('Delivery marked successfully');
        setSnackbarOpen(true); // Open snackbar on success
        setTimeout(() => {
          closeModal();
        }, 2000);
      })
      .catch((err) => {
        setSnackbarMessage('Failed to mark delivery');
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Mark as Deliver
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeModal}
            aria-label="close"
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Delivery Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Received Quantity"
              type="number"
              value={receivedQuantity}
              onChange={(e) => setReceivedQuantity(e.target.value)}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Close
          </Button>
          <Button onClick={handleMarkDeliver} color="primary" variant="contained">
            Mark as Deliver
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
    </>
  );
};

export default MarkDeliverModal;