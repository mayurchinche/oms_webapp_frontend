// AddSupplierModal.js
import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSupplierModal = ({ isOpen, onClose, currentSupplier, onAddSuccess, onUpdateSuccess }) => {
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const { token, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentSupplier) {
      setNewSupplierName(currentSupplier.supplier_name);
      setNewContactNumber(currentSupplier.contact_number);
    }
  }, [currentSupplier]);

  const handleAddSupplier = async () => {
    if (!newSupplierName || !newContactNumber) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await axios.post(
        'https://ordermanagementservice-backend.onrender.com/api/suppliers',
        { contact_number: newContactNumber, supplier_name: newSupplierName },
        { headers: { Authorization: `Bearer ${token}`, role, 'Content-Type': 'application/json' } }
      );
      alert('Supplier added successfully');
      onAddSuccess();
    } catch (err) {
      alert('Failed to add supplier');
    }
  };

  const handleUpdateSupplier = async () => {
    try {
      await axios.put(
        `https://ordermanagementservice-backend.onrender.com/api/suppliers/${currentSupplier.supplier_name}`,
        { contact_number: newContactNumber, supplier_name: newSupplierName },
        { headers: { Authorization: `Bearer ${token}`, role, 'Content-Type': 'application/json' } }
      );
      alert('Supplier updated successfully');
      onUpdateSuccess();
    } catch (err) {
      alert('Failed to update supplier');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Supplier Name"
          variant="outlined"
          fullWidth
          value={newSupplierName}
          onChange={(e) => setNewSupplierName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={newContactNumber}
          onChange={(e) => setNewContactNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={currentSupplier ? handleUpdateSupplier : handleAddSupplier}
          color="primary"
          variant="contained"
        >
          {currentSupplier ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplierModal;
