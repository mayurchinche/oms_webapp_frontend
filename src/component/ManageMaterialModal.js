import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Grid,
  Paper,TextField
} from '@mui/material';

import AddMaterialModal from './AddMaterialModal';
import AddModuleModal from './AddModuleModal';
const ManagingMaterialsStyles = {
  container: {
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '20px'
  },
  materialsGrid: {
    maxHeight: '60vh',
    overflowY: 'auto'
  },
  materialBox: {
    border: '1px solid #D1D1D1',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    position: 'relative',
    marginBottom: '1rem'
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  moduleBox: {
    border: '1px solid #D1D1D1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    padding: '1rem',
    maxHeight: '200px', // Limit height for better UX
    overflowY: 'auto', // Add scrollbar if the content exceeds max height
    marginTop: '1rem',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
  },
  moduleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    borderBottom: '1px solid #E0E0E0',
    ':last-child': {
      borderBottom: 'none' // Remove border for the last item
    }
  },
  loaderOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1'
  }
};

const ManageMaterialModal = ({ isModalOpen, closeModal }) => {
  const [materials, setMaterials] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [loadingMaterial, setLoadingMaterial] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [modules, setModules] = useState({});
  const { role, token } = useSelector((state) => state.auth);
  
  // Create a ref to store the material cards for scrolling
  const materialRefs = useRef({});
  const openAddMaterialModal = () => {
    setIsAddMaterialModalOpen(true);
  };

  const closeAddMaterialModal = () => {
    setIsAddMaterialModalOpen(false);
  };


  const handleAddModule = async (materialName, newModuleName) => {
    setLoading(true);
    try {
      await axios.post(`https://ordermanagementservice-backend.onrender.com/api/add`, {
        material_name: materialName,
        module_name: newModuleName
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      });
      alert('Module added successfully');
      closeAddModuleModal();
      fetchModules(materialName);
    } catch (err) {
      console.error('Failed to add module', err);
      alert('Failed to add module');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isModalOpen) {
       setSearchTerm('');
    setExpandedMaterial(null);
    setModules({});
    setError(null);
      fetchMaterials();
    }
  }, [isModalOpen]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://ordermanagementservice-backend.onrender.com/api/materials',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
          },
        }
      );
      if (response.data && response.data[0] && response.data[0].length > 0) {
        console.log("response.data[0]",response.data[0])
        setMaterials(response.data[0]);
      } else {
        setMaterials([]);
        setError('No materials found');
      }
    } catch (err) {
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (materialName) => {
    setLoadingMaterial(materialName);  // Start loading for this specific material
    try {
      const response = await axios.get(
        `https://ordermanagementservice-backend.onrender.com/api/get/${materialName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
          },
        }
      );
      if (
        response.data &&
        response.data[0] &&
        response.data[0].modules &&
        Array.isArray(response.data[0].modules) &&
        response.data[0].modules.length > 0
      ) {
        setModules((prevModules) => ({
          ...prevModules,
          [materialName]: response.data[0].modules,
        }));
      } else {
        setModules((prevModules) => ({
          ...prevModules,
          [materialName]: [],
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch modules for ${materialName}:`, err);
      setError(`Failed to fetch modules for ${materialName}. Please try again.`);
    } finally {
      setLoadingMaterial(null);  // Finished loading for this specific material
      // Scroll the user back to the clicked material once loading is done
      if (materialRefs.current[materialName]) {
        materialRefs.current[materialName].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleExpandMaterial = async (materialName) => {
    if (loading) return;  // Prevent expanding while global data is loading
    if (expandedMaterial === materialName) {
      setExpandedMaterial(null);
    } else {
      setExpandedMaterial(materialName);
      await fetchModules(materialName);
    }
  };

  const handleDeleteModule = async (materialName, moduleName) => {
    if (window.confirm(`Are you sure you want to delete the module ${moduleName}?`)) {
      setLoading(true);
      try {
        await axios.delete(
          `https://ordermanagementservice-backend.onrender.com/api/delete/${materialName}/${moduleName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              role: role,
            },
            data: {
              material_name: materialName,
              module_name: moduleName,
            },
          }
        );
        alert('Module deleted successfully');
        fetchModules(materialName);
      } catch (err) {
        alert('Failed to delete module');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material.material_name && (material.material_name.toLowerCase().includes(searchTerm.toLowerCase()) || material.material_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const openAddModuleModal = () => {
    setIsAddModuleModalOpen(true);
  };

  const closeAddModuleModal = () => {
    setIsAddModuleModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="lg">
      <DialogTitle>
      
        Manage Materials
       
      </DialogTitle>
  
      <DialogContent dividers sx={{ height: '70vh', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Search Material"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
              onClick={() => setIsAddMaterialModalOpen(true)}
            >
              Add Material
            </Button>
          </Grid>
  
          <Grid item xs={12} sm={6} md={8} sx={{ overflowY: 'auto', maxHeight: 'calc(100% - 20px)' }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading materials, please wait...</Typography>
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Grid container spacing={2} sx={ManagingMaterialsStyles.materialsGrid}>
                {filteredMaterials.map((material, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={3} sx={ManagingMaterialsStyles.materialBox} ref={(el) => materialRefs.current[material.material_code+"-"+material.material_name] = el}>
                      <Typography sx={ManagingMaterialsStyles.subtitle}>{material.material_code+"-"+material.material_name }</Typography>
                      <Typography variant="body2" color="textSecondary">
                          Material Code: {material.material_code}
                        </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => toggleExpandMaterial(material.material_name)}
                      >
                        {expandedMaterial === material.material_name ? 'Collapse' : 'Expand'}
                      </Button>
                      {expandedMaterial === material.material_name && (
                        <Box sx={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              marginBottom: '1rem',
                              backgroundColor: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.dark' },
                            }}
                            onClick={openAddModuleModal}
                          >
                            Add Module
                          </Button>
  
                          <Typography variant="h8" sx={{ marginBottom: '1rem' }}>
                            Available Modules List
                          </Typography>
  
                          <Box
                            sx={{
                              maxHeight: '200px', // Adjust the height as needed
                              overflowY: 'auto',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              padding: '1rem',
                              backgroundColor: '#f9f9f9',
                            }}
                          >
                            {loadingMaterial === material.material_name ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress />
                                <Typography sx={{ marginTop: '0.5rem' }}>Loading modules...</Typography>
                              </Box>
                            ) : modules[material.material_name]?.length > 0 ? (
                              modules[material.material_name].map((module, moduleIndex) => (
                                <Box
                                  key={moduleIndex}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    marginBottom: '0.5rem',
                                  }}
                                >
                                  <Typography variant="body1">{module.module_name}</Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography color="textSecondary">No modules available for this material.</Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>
  
      <DialogActions
        sx={{
          position: 'absolute',  // Position the footer absolutely
          bottom: 0,             // Align it to the bottom
          right: 0,              // Align it to the right
          padding: '16px',       // Add spacing around the button
          width: '100%',         // Ensure it spans the modal width (if needed)
          boxSizing: 'border-box', // Prevent content overflow due to padding
          backgroundColor: '#fff', // Optional: Give it a background if needed
        }}
      >
        <Button onClick={closeModal} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
  
      <AddMaterialModal 
        isModalOpen={isAddMaterialModalOpen}
        closeModal={closeAddMaterialModal}
        refreshMaterials={fetchMaterials}
      />
      <AddModuleModal 
        isAddModuleModalOpen={isAddModuleModalOpen} 
        closeAddModuleModal={closeAddModuleModal}
        handleAddModule={handleAddModule} 
        expandedMaterial={expandedMaterial}
        token={token}
        role={role}
        fetchModules={fetchModules}
      />
    </Dialog>
  );
  
};

export default ManageMaterialModal;
