import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Box, Alert } from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar'; // Import the SuccessSnackbar component
import axios from 'axios';

const AddModuleModal = ({ isAddModuleModalOpen, closeAddModuleModal, expandedMaterial, token, role, fetchModules }) => {
  const [newModuleName, setNewModuleName] = useState('');
  const [isNewModuleNameValid, setIsNewModuleNameValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset the state every time the modal is opened or closed
  useEffect(() => {
    if (!isAddModuleModalOpen) {
      // Reset the state when the modal is closed
      setNewModuleName('');
      setIsNewModuleNameValid(true);
      setLoading(false);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isAddModuleModalOpen]);

  const handleModuleNameChange = (e) => {
    const value = e.target.value;
    setNewModuleName(value);
    setIsNewModuleNameValid(value !== ''); // Validate that the field is not empty
  };

  const handleAddModuleClick = async () => {
    if (!newModuleName) {
      setIsNewModuleNameValid(false);
      setErrorMessage('Module Name is required');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`https://ordermanagementservice-backend.onrender.com/api/add`, {
        material_name: expandedMaterial,
        module_name: newModuleName
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Module successfully added');
      setNewModuleName('');
      setTimeout(() => {
        setSuccessMessage('');
        closeAddModuleModal(); // Close modal after success
        fetchModules(expandedMaterial); // Fetch the updated list of modules
      }, 2000);
    } catch (err) {
      console.error('Failed to add module', err);
      setErrorMessage('Failed to add module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isAddModuleModalOpen} onClose={closeAddModuleModal} fullWidth maxWidth="sm">
      <DialogTitle>Add Module</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              autoFocus
              margin="normal"
              label="Module Name"
              fullWidth
              variant="outlined"
              value={newModuleName}
              onChange={handleModuleNameChange}
              error={!isNewModuleNameValid}
              helperText={!isNewModuleNameValid ? 'Module Name is required' : ''}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAddModuleModal} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleAddModuleClick}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Add Module
        </Button>
      </DialogActions>
      <SuccessSnackbar
        open={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </Dialog>
  );
};

export default AddModuleModal;
