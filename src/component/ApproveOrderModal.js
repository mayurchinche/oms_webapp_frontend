import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Backdrop,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Button as MuiButton,
  styled,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#007bff', // Blue background color
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  '&:hover': {
    // backgroundColor: '#388e3c', // Darker green on hover
    backgroundColor: '#0056b3', // Darker Blue on hover

  },
}));

const SecondaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#007bff', // Blue background color
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  '&:hover': {
    // backgroundColor: '#d32f2f', // Darker red on hover
    backgroundColor: '#0056b3', // Darker red on hover
  },
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  padding: '0',
  margin: '0 5px',
  backgroundColor: 'transparent',
  width: '35px',
  height: '35px',
  '& svg': {
    fontSize: '20px',
  },
}));

const ApproveOrderModal = ({ isModalOpen, closeModal, order, orderType }) => {
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
      order_quantity: orderQuantity,
    };
    setLoading(true);

    // Determine the appropriate URL based on the order type
    const url = orderType === 'reversal'
      ? `https://ordermanagementservice-backend.onrender.com/api/core/orders/reverse/${order.order_id}`
      : `https://ordermanagementservice-backend.onrender.com/api/core/orders/approve/${order.order_id}`;

    axios
      .put(url, approvalData, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json',
        },
      })
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
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Order Quantity:</Typography>
                <CustomIconButton onClick={decreaseQuantity}>
                  <Remove />
                </CustomIconButton>
                <TextField
                  type="text"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  // variant="outlined"
                  size="large"
                  sx={{ width: '100px', textAlign: 'center' }}
                />
                <CustomIconButton onClick={increaseQuantity}>
                  <Add />
                </CustomIconButton>
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
          <SecondaryButton onClick={closeModal} color="secondary" variant="contained">
            Close
          </SecondaryButton>
          <StyledButton onClick={handleApproveOrder} color="primary" variant="contained">
            Approve
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveOrderModal;