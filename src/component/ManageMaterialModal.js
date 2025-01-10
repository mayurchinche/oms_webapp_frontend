import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import AddMaterialModal from './AddMaterialModal';

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
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  moduleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    border: '1px solid #D1D1D1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    marginBottom: '0.5rem'
  }
};

const ManageMaterialModal = ({ isModalOpen, closeModal }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [modules, setModules] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState('');
  const [newModuleName, setNewModuleName] = useState('');

  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen) {
      fetchMaterials();
    }
  }, [isModalOpen]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ordermanagementservice-backend.onrender.com/api/materials', {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      });
      if (response.data && response.data[0] && response.data[0].length > 0) {
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
    setLoading(true);
    try {
      const response = await axios.get(`https://ordermanagementservice-backend.onrender.com/api/get/${materialName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role
        }
      });
      if (response.data && response.data[0] && response.data[0].modules && response.data[0].modules.length > 0) {
        setModules(response.data[0].modules);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error('Failed to fetch modules', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandMaterial = (materialName) => {
    if (expandedMaterial === materialName) {
      setExpandedMaterial(null);
    } else {
      setExpandedMaterial(materialName);
      fetchModules(materialName);
    }
  };

  const handleDeleteModule = async (materialName, moduleName) => {
    if (window.confirm(`Are you sure you want to delete the module ${moduleName} from material ${materialName}?`)) {
      setLoading(true);
      try {
        await axios.delete(`https://ordermanagementservice-backend.onrender.com/api/delete/${materialName}/${moduleName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            role: role,
            'Content-Type': 'application/json'
          },
          data: {
            material_name: materialName,
            module_name: moduleName
          }
        });
        alert('Module deleted successfully');
        fetchModules(materialName);
      } catch (err) {
        console.error('Failed to delete module', err);
        alert('Failed to delete module');
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddMaterialModal = () => {
    setIsAddMaterialModalOpen(true);
  };

  const closeAddMaterialModal = () => {
    setIsAddMaterialModalOpen(false);
  };

  const openUpdateModuleModal = (moduleName) => {
    setCurrentModule(moduleName);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModuleModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateModule = async (materialName, newModuleName) => {
    setLoading(true);
    try {
      await axios.put(`https://ordermanagementservice-backend.onrender.com/api/update/${materialName}/${currentModule}`, {
        module_name: newModuleName
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        }
      });
      alert('Module updated successfully');
      closeUpdateModuleModal();
      fetchModules(materialName);
    } catch (err) {
      console.error('Failed to update module', err);
      alert('Failed to update module');
    } finally {
      setLoading(false);
    }
  };

  const openAddModuleModal = () => {
    setIsAddModuleModalOpen(true);
  };

  const closeAddModuleModal = () => {
    setIsAddModuleModalOpen(false);
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

  const filteredMaterials = materials.filter(material =>
    material.material_name && typeof material.material_name === 'string' && material.material_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Loader while data is being fetched */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Main Modal Dialog for managing materials */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="lg">
        <DialogTitle>
          Manage Materials
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
          <Grid container spacing={2}>
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
                onClick={openAddMaterialModal}
              >
                Add Material
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={8}>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Grid container spacing={2} sx={{ ...ManagingMaterialsStyles.materialsGrid }}>
                  {filteredMaterials.map((material, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={3}
                      sx={ManagingMaterialsStyles.materialBox}>
                      <Typography variant="h6" gutterBottom>{material.material_name}</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => toggleExpandMaterial(material.material_name)}
                        sx={{ mt: 1, mb: 1 }}
                      >
                        {expandedMaterial === material.material_name ? 'Collapse' : 'Expand'}
                      </Button>
                      {expandedMaterial === material.material_name && (
                        <Box mt={2}>
                          <Typography variant="subtitle1" sx={ManagingMaterialsStyles.subtitle}>Modules</Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 1, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                            onClick={openAddModuleModal}
                          >
                            Add Module
                          </Button>
                          <Grid container spacing={1} mt={2}>
                            {modules.map((module, idx) => (
                              <Grid item xs={12} key={idx}>
                                <Box sx={ManagingMaterialsStyles.moduleBox}>
                                  <Typography>{module.module_name}</Typography>
                                  {/* <Box>
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => openUpdateModuleModal(module.module_name)}
                                      sx={{ mr: 1 }}
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => handleDeleteModule(material.material_name, module.module_name)}
                                    >
                                      Delete
                                    </Button>
                                  </Box> */}
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
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

      <DialogActions>
        <Button onClick={closeModal} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Add Material Modal */}
    <AddMaterialModal 
      isModalOpen={isAddMaterialModalOpen}
      closeModal={closeAddMaterialModal}
      refreshMaterials={fetchMaterials}
    />

    {/* Update Module Modal */}
    <Dialog open={isUpdateModalOpen} onClose={closeUpdateModuleModal} fullWidth maxWidth="sm">
      <DialogTitle>Update Module</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="New Module Name"
          fullWidth
          variant="outlined"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeUpdateModuleModal} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={() => handleUpdateModule(expandedMaterial, newModuleName)}
          color="primary"
          variant="contained"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>

    {/* Add Module Modal */}
    <Dialog open={isAddModuleModalOpen} onClose={closeAddModuleModal} fullWidth maxWidth="sm">
      <DialogTitle>Add Module</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Module Name"
          fullWidth
          variant="outlined"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAddModuleModal} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={() => handleAddModule(expandedMaterial, newModuleName)}
          color="primary"
          variant="contained" 
        >
          Add Module
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
};

export default ManageMaterialModal;