import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Typography, TextField, Button, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SuccessSnackbar from './SuccessSnackbar';
import AddSupplierModal from './AddSupplierModal';

const styles = {
  container: {
    display: 'flex',
    padding: '20px',
  },
  leftColumn: {
    width: '25%',
    paddingRight: '20px', // Add some spacing between left and right content
  },
  rightColumn: {
    width: '75%',
    overflowY: 'auto',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  supplierListContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
  },
  supplierBox: {
    border: '1px solid #D1D1D1',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    marginBottom: '1rem',
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
};

const ManageSupplierModal = ({ isModalOpen, closeModal }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isModalOpen) {
      setSearchTerm('');
    
      setError(null);
      fetchSuppliers();
    }
  }, [isModalOpen]);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://ordermanagementservice-backend.onrender.com/api/suppliers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
          },
        }
      );
      setSuppliers(response.data?.[0] || []);
    } catch (err) {
      setError('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openAddSupplierModal = () => {
    setCurrentSupplier(null);
    setIsAddSupplierModalOpen(true);
  };

  const openUpdateSupplierModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsAddSupplierModalOpen(true);
  };

  const handleAddSupplierSuccess = () => {
    fetchSuppliers();
    setIsAddSupplierModalOpen(false);
  };

  const handleUpdateSupplierSuccess = () => {
    fetchSuppliers();
    setIsAddSupplierModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '500px',
            minHeight: '500px',
           
        
            minWidth: '1000px',
            maxWidth: '1000px'
          },
        }}
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
        <DialogContent dividers sx={{ height: '70vh', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
          <Box sx={styles.container}>
            {/* Left Column: Search and Add Supplier */}
            <Box sx={styles.leftColumn}>
              <Box sx={styles.searchContainer}>
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
              </Box>
            </Box>

            {/* Right Column: Supplier List and Loader */}
            <Box sx={styles.rightColumn}>
              {/* List of Suppliers (Scrollable) */}
              {loading ? (
                <Box sx={styles.loaderContainer}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading suppliers, please wait...</Typography>
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              ) : (
                <Box sx={styles.supplierListContainer}>
                  {filteredSuppliers.map((supplier) => (
                    <Paper key={supplier.supplier_name} sx={styles.supplierBox}>
                      <Typography sx={styles.subtitle}>Name: {supplier.supplier_name}</Typography>
                      <Typography >Contact No: {supplier.contact_number}</Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => openUpdateSupplierModal(supplier)}
                      >
                        Update Supplier
                      </Button>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        currentSupplier={currentSupplier}
        onAddSuccess={handleAddSupplierSuccess}
        onUpdateSuccess={handleUpdateSupplierSuccess}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
      />
    </>
  );
};

export default ManageSupplierModal;
