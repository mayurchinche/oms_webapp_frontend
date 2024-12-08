import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Backdrop,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddMaterialModal from './AddMaterialModal';

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
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
            sx={{ mt: 2 }}
            onClick={openAddMaterialModal}
          >
            Add Material
          </Button>
          
          {error ? (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {filteredMaterials.map((material, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{material.material_name}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => toggleExpandMaterial(material.material_name)}
                    >
                      {expandedMaterial === material.material_name ? '-' : '+'}
                    </Button>
                  </Box>
                  {expandedMaterial === material.material_name && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>Available Modules</Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1 }}
                        onClick={openAddModuleModal}
                      >
                        Add Module
                      </Button>
                      <Box sx={{ mt: 2 }}>
                        {modules.map((module, idx) => (
                          <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                        <Typography>{module.module_name}</Typography>
                            <Box>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => openUpdateModuleModal(module.module_name)}
                              >
                                Update
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{ ml: 1 }}
                                onClick={() => handleDeleteModule(material.material_name, module.module_name)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
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
          <DialogContentText>
            Enter the new name for the module.
          </DialogContentText>
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
          <Button onClick={closeUpdateModuleModal} color="primary">
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
          <DialogContentText>
            Enter the name for the new module.
          </DialogContentText>
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
          <Button onClick={closeAddModuleModal} color="primary">
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