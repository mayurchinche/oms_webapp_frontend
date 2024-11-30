import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './AddMaterialModal.css'; // Import the CSS file

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
    <>
      {isModalOpen && <div className="modal-overlay"></div>}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Material</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Material Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  {successMessage && <div className="success-message">{successMessage}</div>}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddMaterial}>Add Material</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMaterialModal;