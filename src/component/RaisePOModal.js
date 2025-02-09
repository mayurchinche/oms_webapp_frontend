import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Backdrop,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SuccessSnackbar from './SuccessSnackbar';

const RaisePOModal = ({ isModalOpen, closeModal, order, fetchOrders, pendingPOColumns }) => {
  const [orderedPrice, setOrderedPrice] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { role, token, userName } = useSelector((state) => state.auth);
  const orderId = order.order_id;

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      setOrderedPrice(order.expected_price || '');
      setPoNumber(orderId || '');
      axios
        .get('https://ordermanagementservice-backend.onrender.com/api/suppliers', {
          headers: { Authorization: `Bearer ${token}`, role: role }
        })
        .then((response) => {
          if (response.data && response.data[0]?.length > 0) {
            setSuppliers(response.data[0]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch suppliers', err);
          setLoading(false);
        });
    }
  }, [isModalOpen, order.expected_price, orderId, token, role]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRaisePO = () => {
    if (!supplierName || !orderedPrice || !poNumber) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    const poData = {
      ordered_price: orderedPrice,
      po_no: poNumber,
      po_raised_by: userName,
      supplier_name: supplierName
    };

    axios
      .post(
        `https://ordermanagementservice-backend.onrender.com/api/core/orders/raise_po/${orderId}`,
        poData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(() => {
        setSnackbarMessage('PO raised successfully');
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarMessage('');
          closeModal();
          // Call fetchOrders to refresh the list
          fetchOrders(
            'https://ordermanagementservice-backend.onrender.com/api/core/orders/get_po_pending_orders',
            pendingPOColumns,
            'pendingPO'
          );
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to raise PO', err);
        setSnackbarMessage('Failed to raise PO');
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Raise PO
         
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Order Price"
              value={orderedPrice}
              onChange={(e) => setOrderedPrice(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="PO Number"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Supplier Name</InputLabel>
              <Select
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                label="Supplier Name"
              >
                <MenuItem value="">
                  <em>Select Supplier</em>
                </MenuItem>
                {suppliers.map((supplier, index) => (
                  <MenuItem key={index} value={supplier.supplier_name}>
                    {supplier.supplier_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="outlined">
            Close
          </Button>
          <Button onClick={handleRaisePO} color="primary" variant="contained">
            Raise PO
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
    </>
  );
};

export default RaisePOModal;
