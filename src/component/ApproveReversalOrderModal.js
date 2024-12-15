import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Backdrop,
  CircularProgress,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const ApproveReversalOrderModal = ({ isModalOpen, closeModal, order, orderType }) => {
  const [expectedPrice, setExpectedPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(order.order_quantity || 0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { role, token, userName } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (order && order.order_quantity) {
      setOrderQuantity(order.order_quantity);
    }
  }, [order]);

  const handleApproveOrder = () => {
    const approvalData = {
      reversal_order_id: order.id
    };
    setLoading(true);

    // Determine the appropriate URL based on the order type
    const url = `https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/approve_reversal_order/${order.id}`;

    axios
      .put(
        url,
        approvalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json'
          }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setSuccessMessage('Order successfully approved');
          setTimeout(() => {
            setSuccessMessage('');
            closeModal();
            navigate('/manager-dashboard'); // Redirect to the pending requests page
          }, 2000);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert('Failed to approve order');
      });
  };

  const increaseQuantity = () => {
    setOrderQuantity(orderQuantity + 1);
  };

  const decreaseQuantity = () => {
    setOrderQuantity(orderQuantity > 0 ? orderQuantity - 1 : 0);
  };

  return (
    <>
      {/* Loader - Backdrop with CircularProgress */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Main Modal Dialog for approving orders */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Approve Reversal Order
        </DialogTitle>
        
        <DialogContent>
          {order && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">Order ID: {order.id}</Typography>
            </Box>
          )}

          {successMessage && (
            <Box mt={2}>
              <Typography color="success.main">{successMessage}</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained">
            Close
          </Button>
          <Button onClick={handleApproveOrder} color="primary" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveReversalOrderModal;