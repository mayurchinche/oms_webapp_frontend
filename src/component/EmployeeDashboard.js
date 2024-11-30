// src/component/EmployeeDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeDashboard.css'; // Import the CSS file
import AddOrderModal from './AddOrderModal';
import RaiseReversalModal from './RaiseReversalModal'; // Import the RaiseReversalModal component
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { role, token, mobileNumber, userName } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false); // Reversal Modal state
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for reversal
  const [reversalMessage, setReversalMessage] = useState(''); // Message for reversal status
  const [activeSection, setActiveSection] = useState('forward'); // Active section state
  const navigate = useNavigate();

  const fetchOrders = useCallback((url) => {
    setLoading(true);
    setError(null);
    console.log('Fetching orders with token:', token, 'and role:', role);
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role
      }
    })
      .then(response => {
        console.log('API Response:', response.data);
        if (response.data && response.data[0] && response.data[0].data && response.data[0].data.length > 0) {
          setOrders(response.data[0].data); // Access the nested data array
          console.log('Orders set:', response.data[0].data); // Log the nested data array
        } else {
          setError('No records found');
          console.log('No records found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, [token, role]);

  useEffect(() => {
    if (mobileNumber && token && role) {
      fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
    }
  }, [mobileNumber, token, role, fetchOrders]);

  const handleForwardOrderClick = () => {
    console.log('Forward Order clicked');
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
  };

  const handleReversalOrderClick = () => {
    console.log('Fetching reversal orders...');
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_orders/${mobileNumber}`);
  };

  const handleViewOrderClick = () => {
    console.log('Fetching orders...');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
  };

  const openModal = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  const openReversalModal = (order) => {
    console.log('Opening reversal modal for order:', order);
    if (order && order.status === 'Delivered') {
      setSelectedOrder(order);
      setIsReversalModalOpen(true);
    } else {
      setReversalMessage('Order has not been delivered yet.');
      setTimeout(() => {
        setReversalMessage('');
      }, 3000);
    }
  };

  const closeReversalModal = () => {
    console.log('Closing reversal modal');
    setIsReversalModalOpen(false);
    setSelectedOrder(null);
  };

  const logOut = () => {
    navigate("/login");
  };

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        <div className="col-md-2 col-12 sidebar bg-dark text-white vh-100 p-3">
          <div className="user-info text-center">
            <img src="https://th.bing.com/th?id=OIP.Q9rsZpd4tcVdZAmeChgtXAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2" alt="User Logo" className="user-logo img-fluid rounded-circle mb-3" />
            <h5>Welcome, {userName}</h5>
            <p>{mobileNumber}</p>
            <hr />
          </div>
          <nav className="nav flex-column">
            <button className="btn btn-primary mb-2" onClick={openModal}>Add Order</button>
            <button className="btn btn-primary mb-2">Remove Order</button>
            <button className="btn btn-primary mb-2" onClick={handleViewOrderClick}>View Order</button>
            {/* Add more buttons as needed */}
          </nav>
          <button className="btn btn-danger mt-auto" onClick={logOut}>Logout</button>
        </div>
        <div className="col-md-10 col-12 main-content p-0">
          <div className="header bg-dark text-white p-3 d-flex justify-content-between" style={{ paddingRight: 20, width: '100%' }}>
            <div
              className={`header-section ${activeSection === 'forward' ? 'active' : ''}`}
              onClick={handleForwardOrderClick}
            >
              Forward Orders
            </div>
            <div
              className={`header-section ${activeSection === 'reversal' ? 'active' : ''}`}
              onClick={handleReversalOrderClick}
            >
              Reversal Orders
            </div>
          </div>
          <div className="content-area p-3">
            {loading ? (
              <div className="loading-overlay">
                <div className="loading-modal">
                  <div className="loading-content">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading data, please wait...</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <div className="table-container">
                <table className="table table-striped table-bordered table-hover custom-table">
                  <thead>
                    <tr>
                      <th>Order Date</th>
                      <th>Material Name</th>
                      <th>Model</th>
                      <th>Customer Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      order && order.order_date ? (
                        <tr key={index}>
                          <td>{order.order_date}</td>
                          <td>{order.material_name}</td>
                          <td>{order.model}</td>
                          <td>{order.name_of_customer}</td>
                          <td>{order.status}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => openReversalModal(order)}
                              disabled={order.status !== 'Delivered'}
                            >
                              Raise Reversal
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={index}>
                          <td colSpan="6">Invalid order data</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddOrderModal isModalOpen={isModalOpen} closeModal={closeModal} />
      {selectedOrder && (
        <RaiseReversalModal isModalOpen={isReversalModalOpen} closeModal={closeReversalModal} order={selectedOrder} />
      )}
      {reversalMessage && (
        <div className="reversal-message-overlay">
          <div className="reversal-message-dialog">
            <h5>Notice</h5>
            <p>{reversalMessage}</p>
            <button type="button" className="btn btn-primary" onClick={() => setReversalMessage('')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;