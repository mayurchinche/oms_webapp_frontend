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
import CloseIcon from '@mui/icons-material/Close';
import { Add, Remove } from '@mui/icons-material';

const ApproveOrderModal = ({ isModalOpen, closeModal, order }) => {
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
      approved_by: userName,
      expected_price: expectedPrice,
      order_quantity: orderQuantity
    };

    setLoading(true);
    axios
      .put(
        `https://ordermanagementservice-backend.onrender.com/api/core/orders/approve/${order.order_id}`,
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
          Approve Order
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
          {order && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">Order ID: {order.order_id}</Typography>
              <TextField
                label="Expected Price"
                type="number"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Order Quantity:</Typography>
                <IconButton onClick={decreaseQuantity}>
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  variant="outlined"
                  size="small"
                  sx={{ width: '80px' }}
                />
                <IconButton onClick={increaseQuantity}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          )}
          
          {successMessage && (
            <Box mt={2}>
              <Typography color="success.main">{successMessage}</Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
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

export default ApproveOrderModal;