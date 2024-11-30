import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddMaterialModal from './AddMaterialModal'; // Import the AddMaterialModal component
import './ManageMaterialModal.css'; // Import the CSS file

const ManageMaterialModal = ({ isModalOpen, closeModal }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for materials
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false); // Add Material Modal state
  const [expandedMaterial, setExpandedMaterial] = useState(null); // State to track expanded material
  const [modules, setModules] = useState([]); // State to track modules for expanded material
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Update Module Modal state
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false); // Add Module Modal state
  const [currentModule, setCurrentModule] = useState(''); // State to track current module for update
  const [newModuleName, setNewModuleName] = useState(''); // State to track new module name

  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchMaterials = () => {
    setLoading(true);
    setError(null);
    axios.get('https://ordermanagementservice-backend.onrender.com/api/materials', {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Materials fetched:', response.data);
        if (response.data && response.data[0] && response.data[0].length > 0) {
          setMaterials(response.data[0]); // Access the inner array and set the materials data
          console.log(response.data[0]); // Log the data array
        } else {
          setError('No materials found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch materials');
        setLoading(false);
      });
  };

  const fetchModules = (materialName) => {
    axios.get(`https://ordermanagementservice-backend.onrender.com/api/get/${materialName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Response:', response.data); // Log the entire response object
        if (response.data && response.data[0] && response.data[0].modules && response.data[0].modules.length > 0) {
          setModules(response.data[0].modules); // Set the modules data
          console.log('Modules fetched:', response.data[0].modules); // Log the data array
        } else {
          setModules([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch modules', err);
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchMaterials();
    }
  }, [isModalOpen]);

  const filteredMaterials = materials.filter(material =>
    material.material_name && typeof material.material_name === 'string' && material.material_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddMaterialModal = () => {
    setIsAddMaterialModalOpen(true);
  };

  const closeAddMaterialModal = () => {
    setIsAddMaterialModalOpen(false);
  };

  const toggleExpandMaterial = (materialName) => {
    if (expandedMaterial === materialName) {
      setExpandedMaterial(null);
    } else {
      setExpandedMaterial(materialName);
      fetchModules(materialName);
    }
  };

  const handleDeleteModule = (materialName, moduleName) => {
    if (window.confirm(`Are you sure you want to delete the module ${moduleName} from material ${materialName}?`)) {
      axios.delete(`https://ordermanagementservice-backend.onrender.com/api/delete/${materialName}/${moduleName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
          'Content-Type': 'application/json'
        },
        data: {
          material_name: materialName,
          module_name: moduleName
        }
      })
        .then(response => {
          console.log('Module deleted:', response.data);
          alert('Module deleted successfully');
          navigate('//Manager-dashboard'); // Navigate to the dashboard page
        })
        .catch(err => {
          console.error('Failed to delete module', err);
          alert('Failed to delete module');
        });
    }
  };

  const openUpdateModuleModal = (moduleName) => {
    setCurrentModule(moduleName);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModuleModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateModule = (materialName, newModuleName) => {
    axios.put(`https://ordermanagementservice-backend.onrender.com/api/update/${materialName}/${currentModule}`, { module_name: newModuleName }, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Module updated:', response.data);
        console.log('Module updated:', currentModule);
        alert('Module updated successfully');
        closeUpdateModuleModal();
        fetchModules(materialName); // Refresh the modules list
      })
      .catch(err => {
        console.error('Failed to update module', err);
        alert('Failed to update module');
      });
  };

  const openAddModuleModal = () => {
    setIsAddModuleModalOpen(true);
  };

  const closeAddModuleModal = () => {
    setIsAddModuleModalOpen(false);
  };

  const handleAddModule = (materialName, newModuleName) => {
    axios.post(`https://ordermanagementservice-backend.onrender.com/api/add`, { material_name: materialName, module_name: newModuleName }, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Module added:', response.data);
        alert('Module added successfully');
        closeAddModuleModal();
        navigate('/Manager-dashboard'); // Navigate to the dashboard page
      })
      .catch(err => {
        console.error('Failed to add module', err);
        alert('Failed to add module');
      });
  };

  return (
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <input
                type="text"
                placeholder="Search Material"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="search-button">Search</button>
              <button className="add-material-button" onClick={openAddMaterialModal}>Add Material</button>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <div className="material-list">
                  {filteredMaterials.map((material, index) => (
                    <div key={index} className="material-item">
                      <div className="material-header">
                        <span>{material.material_name}</span>
                        <button className="expand-button" onClick={() => toggleExpandMaterial(material.material_name)}>
                          {expandedMaterial === material.material_name ? '-' : '+'}
                        </button>
                      </div>
                      {expandedMaterial === material.material_name && (
                        <div className="module-list">
                          <div className="module-header">
                            <span>Available Modules</span>
                            <button className="add-module-button" onClick={openAddModuleModal}>Add Module</button>
                          </div>
                          <div className="module-body">
                            {modules.map((module, idx) => (
                              <div key={idx} className="module-item">
                                <span>{module.module_name}</span>
                                <button className="module-button" onClick={() => openUpdateModuleModal(module.module_name)}>Update</button>
                                <button className="module-button" onClick={() => handleDeleteModule(material.material_name, module.module_name)}>Delete</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddMaterialModal isModalOpen={isAddMaterialModalOpen} closeModal={closeAddMaterialModal} refreshMaterials={fetchMaterials} />
      {isUpdateModalOpen && (
        <div className="modal-overlay"></div>
      )}
      <div className={`modal ${isUpdateModalOpen ? 'show' : ''}`} style={{ display: isUpdateModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Module</h5>
              <button type="button" className="close" onClick={closeUpdateModuleModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>New Module Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentModule}
                  onChange={(e) => setCurrentModule(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeUpdateModuleModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => handleUpdateModule(expandedMaterial, currentModule)}>Update Module</button>
            </div>
          </div>
        </div>
      </div>
      {isAddModuleModalOpen && (
        <div className="modal-overlay"></div>
      )}
      <div className={`modal ${isAddModuleModalOpen ? 'show' : ''}`} style={{ display: isAddModuleModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Module</h5>
              <button type="button" className="close" onClick={closeAddModuleModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Module Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeAddModuleModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => handleAddModule(expandedMaterial, newModuleName)}>Add Module</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMaterialModal;