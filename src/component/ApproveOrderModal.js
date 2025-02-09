import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SuccessSnackbar from './SuccessSnackbar';
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
  Button,
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
    backgroundColor: '#0056b3', // Darker blue on hover
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
  const [expectedPrice, setExpectedPrice] = useState(0); // Default value set to 0
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
 const [successMessage, setSuccessMessage] = useState('');
  const { role, token, userName } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Reset modal state when opening
  useEffect(() => {
    if (isModalOpen && order) {
      setOrderQuantity(order.order_quantity || 0);
      setExpectedPrice(0);
    }
  }, [isModalOpen, order]);

  const handleApproveOrder = async () => {
    setLoading(true);  // Start loader
    const approvalData = {
      approved_by: userName,
      expected_price: expectedPrice,
      order_quantity: orderQuantity,
    };
  
    const url =
      orderType === 'reversal'
        ? `https://ordermanagementservice-backend.onrender.com/api/core/orders/reverse/${order.order_id}`
        : `https://ordermanagementservice-backend.onrender.com/api/core/orders/approve/${order.order_id}`;
  
    try {
      const response = await axios.put(url, approvalData, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response:', response); // Log response to check status code
      if (response.status === 200) {
        setLoading(false);
        setSuccessMessage('Request Approved Successfully');
        setTimeout(() => {
          setSuccessMessage('');
          closeModal();
          navigate('/manager-dashboard');
        }, 3000);
      } else {
        // Handle non-200 status code
        setLoading(false);
        alert('Failed to approve order. Please try again.');
      }
    }    catch (error) {
      // Catch any network errors or errors from the API call
      setLoading(false);
      console.error('Error approving order:', error);
      alert('Failed to approve order. Please try again.');
    }
  };
  
  

  const increaseQuantity = () => {
    setOrderQuantity(orderQuantity + 1);
  };

  const decreaseQuantity = () => {
    setOrderQuantity(orderQuantity > 0 ? orderQuantity - 1 : 0);
  };

  return (
    <>
      {/* Loader */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Approve Order</DialogTitle>

        <DialogContent>
          {order && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">Order ID: {order.order_id}</Typography>
              <TextField
                label="Expected Price"
                type="number"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                variant="outlined"
                fullWidth
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Order Quantity:</Typography>
                <CustomIconButton onClick={decreaseQuantity}>
                  <Remove />
                </CustomIconButton>
                <TextField
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  variant="outlined"
                  size="small"
                  sx={{ width: '100px', textAlign: 'center' }}
                />
                <CustomIconButton onClick={increaseQuantity}>
                  <Add />
                </CustomIconButton>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={closeModal} color="secondary" variant="contained">
            Close
          </SecondaryButton>
          {/* <StyledButton onClick={handleApproveOrder} color="primary" variant="contained">
            Approve
          </StyledButton> */}
           <Box position="relative">
      <Button
        onClick={handleApproveOrder}
        color="primary"
        variant="contained"
        disabled={loading}
        sx={{ position: 'relative', paddingRight: '2rem' }} // Adjust padding for loader space
      >
        Approve
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-20%, -50%)', // Center the loader inside the button
              color: '#fff',
            }}
          />
        )}
      </Button>
    </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveOrderModal;
