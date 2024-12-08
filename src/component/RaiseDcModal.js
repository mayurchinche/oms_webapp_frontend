import React, { useState } from 'react';
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

const RaiseDcModal = ({ isModalOpen, closeModal, order, fetchOrders, dcPendingColumns }) => {
  const [dcNumber, setDcNumber] = useState('');
  const { role, token } = useSelector((state) => state.auth);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const orderId=order.id
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRaiseDC = () => {
    if (!dcNumber) {
      setSnackbarMessage('Please enter a DC number.');
      setSnackbarOpen(true);
      return;
    }

    const dcData = {
      dc_number: dcNumber
    };

    axios.put(
      `https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/submit_dc_for_reversal/${orderId}`,
      dcData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      setSnackbarMessage('DC raised successfully');
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarMessage('');
        closeModal();
        fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_dc_pending', dcPendingColumns, 'dcPending');
      }, 2000);
    })
    .catch(err => {
      setSnackbarMessage('Failed to raise DC');
      setSnackbarOpen(true);
    });
  };

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Raise DC
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
              label="DC Number"
              type="text"
              value={dcNumber}
              onChange={(e) => setDcNumber(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleRaiseDC} color="primary" variant="contained">
            Raise DC
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
    </>
  );
};

export default RaiseDcModal;