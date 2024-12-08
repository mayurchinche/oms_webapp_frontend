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

const DcDeliverModal = ({ isModalOpen, closeModal, order }) => {
  const [deliveredAt, setDeliveredAt] = useState('');
  const orderId = order?.id; // Handle possible `undefined`
  const { role, token } = useSelector((state) => state.auth);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar

  useEffect(() => {
    if (isModalOpen && order) {
      // Set initial values when the modal opens
      const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      setDeliveredAt(currentDate);
      setSnackbarMessage('');
    }
  }, [isModalOpen, order]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDCDeliver = () => {
    if (!deliveredAt) {
      setSnackbarMessage('Please enter the delivery date.');
      setSnackbarOpen(true);
      return;
    }

    const deliveryData = {
      delivered_at: deliveredAt,
    };

    axios
      .put(
        `https://ordermanagementservice-backend.onrender.com/api/core/orders/revrsal/delivery/${orderId}`,
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
        setSnackbarMessage('Reversal delivery marked successfully');
        setSnackbarOpen(true); // Open snackbar on success
        setTimeout(() => {
          closeModal();
        }, 2000);
      })
      .catch((err) => {
        setSnackbarMessage('Failed to mark reversal delivery');
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          DC Deliver
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
              value={deliveredAt}
              onChange={(e) => setDeliveredAt(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDCDeliver} color="primary" variant="contained">
            DC Deliver
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
    </>
  );
};

export default DcDeliverModal;