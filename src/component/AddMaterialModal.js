import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const AddMaterialModal = ({ isModalOpen, closeModal, refreshMaterials }) => {
  const [materialName, setMaterialName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const { role, token } = useSelector((state) => state.auth);

  const handleAddMaterial = () => {
    setLoading(true);
    setError(null);
    const newMaterial = {
      material_name: materialName,
      description: description
    };
    axios.post('https://ordermanagementservice-backend.onrender.com/api/materials', newMaterial, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Material added:', response.data);
        setLoading(false);
        setSuccessMessage('Material added successfully');
        setTimeout(() => {
          setSuccessMessage('');
          closeModal();
          refreshMaterials(); // Refresh the materials list
        }, 2000);
      })
      .catch(err => {
        setError('Failed to add material');
        setLoading(false);
      });
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Material
        <IconButton
          edge="end"
          color="inherit"
          onClick={closeModal}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Material Name"
              type="text"
              fullWidth
              variant="outlined"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="secondary">
          Close
        </Button>
        <Button
          onClick={handleAddMaterial}
          color="primary"
          variant="contained"
        >
          Add Material
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterialModal;