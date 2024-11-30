import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './ManageMaterials.css'; // Import the CSS file

const ManageMaterials = ({ isModalOpen, closeModal }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for materials

  const { role, token } = useSelector((state) => state.auth);

  const fetchMaterials = () => {
    setLoading(true);
    setError(null);
    axios.get(' https://ordermanagementservice-backend.onrender.com/api/materials', {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('Materials fetched:', response.data);
        if (response.data && response.data.length > 0) {
          setMaterials(response.data); // Set the materials data
          console.log(response.data); // Log the data array
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

  useEffect(() => {
    if (isModalOpen) {
      fetchMaterials();
    }
  }, [isModalOpen]);

  const filteredMaterials = materials.filter(material =>
    material.material_name && typeof material.material_name === 'string' && material.material_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button className="add-material-button">Add Material</button>
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
                      <span>{material.material_name}</span>
                      <button className="material-button">Add Module</button>
                      <button className="material-button">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMaterials;