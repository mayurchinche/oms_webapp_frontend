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
  Backdrop,
  Grid,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SuccessSnackbar from './SuccessSnackbar';

const ManagingSuppliersStyles = {
  container: {
    padding: '20px',
  },
  supplierBox: {
    border: '1px solid #D1D1D1',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    marginBottom: '1rem'
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  }
};

const ManageSupplierModal = ({ isModalOpen, closeModal }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliers();
    }
  }, [isModalOpen]);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ordermanagementservice-backend.onrender.com/api/suppliers', {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      });
      setSuppliers((response.data && response.data[0]) ? response.data[0] : []);
    } catch (err) {
      setError('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name &&
    typeof supplier.supplier_name === 'string' &&
    supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openAddSupplierModal = () => {
    setNewSupplierName('');
    setNewContactNumber('');
    setCurrentSupplier(null);
    setIsAddSupplierModalOpen(true);
  };

  const closeAddSupplierModal = () => {
    setIsAddSupplierModalOpen(false);
  };

  const handleAddSupplier = async () => {
    const supplierData = {
      contact_number: newContactNumber,
      supplier_name: newSupplierName
    };
    if (!supplierData.contact_number || !supplierData.supplier_name) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post('https://ordermanagementservice-backend.onrender.com/api/suppliers', supplierData, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      });
      setSnackbarMessage('Supplier added successfully');
      setSnackbarOpen(true);
      closeAddSupplierModal();
      fetchSuppliers();
    } catch (err) {
      setSnackbarMessage('Failed to add supplier');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSupplier = async (supplierName) => {
    if (window.confirm(`Are you sure you want to delete the supplier ${supplierName}?`)) {
      try {
        await axios.delete(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${supplierName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json'
          }
        });
        alert('Supplier deleted successfully');
        fetchSuppliers();
      } catch (err) {
        alert('Failed to delete supplier');
      }    }
    };
  
    const openUpdateSupplierModal = (supplier) => {
      setCurrentSupplier(supplier);
      setNewSupplierName(supplier.supplier_name);
      setNewContactNumber(supplier.contact_number);
      setIsAddSupplierModalOpen(true);
    };
  
    const handleUpdateSupplier = async () => {
      const updatedSupplierData = {
        contact_number: newContactNumber,
        supplier_name: newSupplierName
      };
  
      try {
        await axios.put(`https://ordermanagementservice-backend.onrender.com/api/suppliers/${currentSupplier.supplier_name}`, updatedSupplierData, {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json'
          }
        });
        setSnackbarMessage('Supplier updated successfully');
        setSnackbarOpen(true);
        closeAddSupplierModal();
        fetchSuppliers();
      } catch (err) {
        setSnackbarMessage('Failed to update supplier');
        setSnackbarOpen(true);
      }
    };
  
    return (
      <>
        {/* Loader - Backdrop with CircularProgress */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
  
        {/* Main Modal Dialog for managing suppliers */}
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          fullWidth
          maxWidth="md"
        >
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
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredSuppliers.map((supplier, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper sx={ManagingSuppliersStyles.supplierBox}>
                      <Typography variant="h6" gutterBottom>{supplier.supplier_name}</Typography>
                      <Typography variant="subtitle1">Contact Number: {supplier.contact_number}</Typography>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
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
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
  
          <DialogActions>
            <Button onClick={closeModal} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Add or Update Supplier Modal */}
        <Dialog
          open={isAddSupplierModalOpen}
          onClose={closeAddSupplierModal}
          fullWidth
          maxWidth="sm"
        >
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
    
          {/* Snackbar for success and error messages */}
          <SuccessSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            onClose={handleSnackbarClose}
          />
        </>
      );
    };
    
    export default ManageSupplierModal;  