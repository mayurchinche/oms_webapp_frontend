import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ManageSupplierModal = ({ isModalOpen, closeModal }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const { role, token } = useSelector((state) => state.auth);

  const fetchSuppliers = () => {
    setLoading(true);
    setError(null);
    axios.get('https://ordermanagementservice-backend.onrender.com/api/suppliers', {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        setSuppliers((response.data && response.data[0]) ? response.data[0] : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch suppliers');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliers();
    }
  }, [isModalOpen]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name && typeof supplier.supplier_name === 'string' && supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddSupplierModal = () => {
    setNewSupplierName('');
    setNewContactNumber('');
    setCurrentSupplier(null);
    setIsAddSupplierModalOpen(true);
  };

  const closeAddSupplierModal = () => {
    setIsAddSupplierModalOpen(false);
  };

  const handleAddSupplier = () => {
    const supplierData = {
      contact_number: newContactNumber,
      supplier_name: newSupplierName
    };

    axios.post('https://ordermanagementservice-backend.onrender.com/api/suppliers', supplierData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert('Supplier added successfully');
        closeAddSupplierModal();
        fetchSuppliers();
      })
      .catch(err => {
        alert('Failed to add supplier');
      });
  };

  const handleDeleteSupplier = (supplierName) => {
    if (window.confirm(`Are you sure you want to delete the supplier ${supplierName}?`)) {
      axios.delete(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${supplierName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          alert('Supplier deleted successfully');
          fetchSuppliers();
        })
        .catch(err => {
          alert('Failed to delete supplier');
        });
    }
  };

  const openUpdateSupplierModal = (supplier) => {
    setCurrentSupplier(supplier);
    setNewSupplierName(supplier.supplier_name);
    setNewContactNumber(supplier.contact_number);
    setIsAddSupplierModalOpen(true);
  };

  const handleUpdateSupplier = () => {
    const updatedSupplierData = {
      contact_number: newContactNumber,
      supplier_name: newSupplierName
    };

    axios.put(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${currentSupplier.supplier_name}`, updatedSupplierData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert('Supplier updated successfully');
        closeAddSupplierModal();
        fetchSuppliers();
      })
      .catch(err => {
        alert('Failed to update supplier');
      });
  };

  return (
    <>
      {/* Loader - Backdrop with CircularProgress */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Main Modal Dialog for managing suppliers */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
        <DialogTitle>
          Manage Suppliers
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
        
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Search Supplier"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={openAddSupplierModal}
          >
            Add Supplier
          </Button>
          
          {error ? (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {filteredSuppliers.map((supplier, index) => (
                <Box key={index} sx={{ mb: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{supplier.supplier_name}</Typography>
                    <Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => openUpdateSupplierModal(supplier)}
                        sx={{ mr: 1 }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteSupplier(supplier.supplier_name)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>Contact Number: {supplier.contact_number}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add or Update Supplier Modal */}
      <Dialog open={isAddSupplierModalOpen} onClose={closeAddSupplierModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeAddSupplierModal}
            aria-label="close"
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Supplier Name"
            fullWidth
            variant="outlined"
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Contact Number"
            fullWidth
            variant="outlined"
            value={newContactNumber}
            onChange={(e) => setNewContactNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddSupplierModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={currentSupplier ? handleUpdateSupplier : handleAddSupplier}
            color="primary"
            variant="contained"
          >
            {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageSupplierModal;