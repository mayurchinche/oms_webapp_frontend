import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar';
import AddSupplierModal from './AddSupplierModal';

const styles = {
  container: {
    padding: '20px',
  },
  leftColumn: {
    paddingRight: '20px',
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
  // sx={{
  //   '& .MuiDialog-paper': {
  //     maxHeight: '500px',
  //     minHeight: '500px',
     
  
  //     minWidth: '1000px',
  //     maxWidth: '1000px'
  //   },

  // }}
  sx={{
    '& .MuiDialog-paper': {
      maxHeight: '550px',
      minHeight: '550px',
      minWidth: '1000px',
      maxWidth: '1000px',
      // Responsive styles for mobile devices
      '@media (max-width: 550px)': {
        maxWidth: '90%', // Adjust width for mobile
        minWidth: '90%', // Adjust width for mobile
        margin: '0 auto', // Center the dialog
      },
    },
  }}
>
        <DialogTitle>Manage Suppliers</DialogTitle>
        <DialogContent dividers sx={{ height: '100%', backgroundColor: '#f9f9f9' }}>
          <Grid container spacing={2} sx={styles.container}>
            {/* Left Column: Search and Add Supplier */}
            <Grid item xs={12} sm={4}>
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
            </Grid>

            {/* Right Column: Supplier List and Loader */}
            <Grid item xs={12} sm={8}>
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
                      <Typography>Contact No: {supplier.contact_number}</Typography>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained">
            Close
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
