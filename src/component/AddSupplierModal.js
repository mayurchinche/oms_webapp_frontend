import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SuccessSnackbar from './SuccessSnackbar';
const AddSupplierModal = ({ isOpen, onClose, currentSupplier, onAddSuccess, onUpdateSuccess }) => {
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [errors, setErrors] = useState({});
  const { token, role } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
 const [successMessage, setSuccessMessage] = useState('');
 useEffect(() => {
  if (isOpen) {
    if (currentSupplier) {
      setNewSupplierName(currentSupplier.supplier_name);
      setNewContactNumber(currentSupplier.contact_number);
    } else {
      setNewSupplierName('');
      setNewContactNumber('');
    }
    setErrors({});
    setSuccessMessage('');
  }
}, [isOpen, currentSupplier]);
  useEffect(() => {
    if (currentSupplier) {
      setNewSupplierName(currentSupplier.supplier_name);
      setNewContactNumber(currentSupplier.contact_number);
    } else {
      setNewSupplierName('');
      setNewContactNumber('');
    }
    setErrors({});
  }, [currentSupplier]);

  const validateInputs = () => {
    const newErrors = {};
    if (!newSupplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required.';
    } else if (newSupplierName.length < 3) {
      newErrors.supplierName = 'Supplier name must be at least 3 characters long.';
    }

    if (!newContactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required.';
    } else if (!/^[0-9]{10}$/.test(newContactNumber)) {
      newErrors.contactNumber = 'Contact number must be a 10-digit numeric value.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleAddSupplier = async () => {
//     if (!validateInputs()) return;

//     try {
//       await axios.post(
//         'https://ordermanagementservice-backend.onrender.com/api/suppliers',
//         { contact_number: newContactNumber, supplier_name: newSupplierName },
//         { headers: { Authorization: `Bearer ${token}`, role, 'Content-Type': 'application/json' } }
//       );
//       setSuccessMessage('Supplier added successfully');
      
//       onAddSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to add supplier. Please try again.');
//     }
//   };
const handleAddSupplier = async () => {
    if (!validateInputs()) return;

    setLoading(true); // Start loader
    try {
      await axios.post(
        'https://ordermanagementservice-backend.onrender.com/api/suppliers',
        { contact_number: newContactNumber, supplier_name: newSupplierName },
        { headers: { Authorization: `Bearer ${token}`, role, 'Content-Type': 'application/json' } }
      );
     
      setSuccessMessage('Supplier added successfully');
      onAddSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add supplier. Please try again.');
    } finally {
      setLoading(false); // Stop loader
    }
  };
  const handleUpdateSupplier = async () => {
    if (!validateInputs()) return;

    try {
      await axios.put(
        `https://ordermanagementservice-backend.onrender.com/api/suppliers/${currentSupplier.supplier_name}`,
        { contact_number: newContactNumber, supplier_name: newSupplierName },
        { headers: { Authorization: `Bearer ${token}`, role, 'Content-Type': 'application/json' } }
      );
      alert('Supplier updated successfully');
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update supplier. Please try again.');
    }
  };

  return (
    <>
   <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Supplier Name"
          variant="outlined"
          fullWidth
          value={newSupplierName}
          onChange={(e) => setNewSupplierName(e.target.value)}
          error={!!errors.supplierName}
          helperText={errors.supplierName}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={newContactNumber}
          onChange={(e) => setNewContactNumber(e.target.value)}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Box position="relative">
          <Button
            onClick={currentSupplier ? handleUpdateSupplier : handleAddSupplier}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {currentSupplier ? 'Update' : 'Add'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                maxHeight: '200px', // Adjust the height as needed
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
    <SuccessSnackbar
        open={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
    
    </>
   

    
  );
};

export default AddSupplierModal;

