import React, { useState } from 'react';
import { TextField, Button, Box, Modal, Fade, CircularProgress, Typography, Backdrop, Alert } from '@mui/material';
import SuccessSnackbar from './SuccessSnackbar'; // Import the SuccessSnackbar component
import axios from 'axios';
import { useSelector } from 'react-redux';
import './AddMaterialModal.css'; // For custom styles

const AddMaterialModal = ({ isModalOpen, closeModal, refreshMaterials }) => {
  const [materialName, setMaterialName] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMaterialNameValid, setIsMaterialNameValid] = useState(true);
  const [isMaterialDescriptionValid, setIsMaterialDescriptionValid] = useState(true);

  const { token, role } = useSelector((state) => state.auth);

  // Handle Add Material button click
  const handleAddMaterial = () => {
    // Validation
    if (!materialName || !materialDescription) {
      setIsMaterialNameValid(!!materialName);
      setIsMaterialDescriptionValid(!!materialDescription);
      setErrorMessage('All fields are required.');
      return;
    }

    setLoading(true);
    const materialData = {
      material_name: materialName,
      material_description: materialDescription,
    };

    // API request to add material
    axios.post('https://ordermanagementservice-backend.onrender.com/api/materials', materialData, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        role: role,
        'Content-Type': 'application/json', // Ensure correct content-type
      },
    })
    .then(response => {
      setLoading(false);
      if (response.status === 200) {
        setSuccessMessage('Material successfully added');
        setMaterialName('');
        setMaterialDescription('');
        setTimeout(() => {
          setSuccessMessage('');
          closeModal();
          refreshMaterials(); // Refresh the materials list
        }, 2000);
      }
    })
    .catch(error => {
      setLoading(false);
      setErrorMessage('Failed to add material. Please try again.');
    });
  };

  // Handle input change for material name
  const handleMaterialNameChange = (e) => {
    const value = e.target.value;
    setMaterialName(value);
    // Reset validation state for material name if the user types anything
    if (value) setIsMaterialNameValid(true);
  };

  // Handle input change for material description
  const handleMaterialDescriptionChange = (e) => {
    const value = e.target.value;
    setMaterialDescription(value);
    // Reset validation state for material description if the user types anything
    if (value) setIsMaterialDescriptionValid(true);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h5" component="h2">Add Material</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Material Name"
                  value={materialName}
                  onChange={handleMaterialNameChange}
                  variant="outlined"
                  error={!isMaterialNameValid}
                  helperText={!isMaterialNameValid ? 'Material name is required' : ''}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Material Description"
                  value={materialDescription}
                  onChange={handleMaterialDescriptionChange}
                  variant="outlined"
                  error={!isMaterialDescriptionValid}
                  helperText={!isMaterialDescriptionValid ? 'Material description is required' : ''}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" color="error" onClick={closeModal}>Close</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddMaterial}
                    disabled={loading}
                  >
                    Adding Material
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
      <SuccessSnackbar
        open={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </>
  );
};

export default AddMaterialModal;
