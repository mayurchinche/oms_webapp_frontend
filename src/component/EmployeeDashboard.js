import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeDashboard.css'; // Import the updated CSS file
import AddOrderModal from './AddOrderModal';
import RaiseReversalModal from './RaiseReversalModal';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { role, token, mobileNumber, userName } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reversalMessage, setReversalMessage] = useState('');
  const [activeSection, setActiveSection] = useState('forward');
  const [sidebarVisible, setSidebarVisible] = useState(true); // Toggle sidebar visibility for smaller screens
  const navigate = useNavigate();

  const fetchOrders = useCallback((url) => {
    setLoading(true);
    setError(null);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: role,
        },
      })
      .then((response) => {
        const data = response.data?.[0]?.data || [];
        if (data.length > 0) {
          setOrders(data);
        } else {
          setError('No records found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [token, role]);

  useEffect(() => {
    if (mobileNumber && token && role) {
      fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
    }
  }, [mobileNumber, token, role, fetchOrders]);

  const handleForwardOrderClick = () => {
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
  };

  const handleReversalOrderClick = () => {
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_orders/${mobileNumber}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openReversalModal = (order) => {
    if (order?.status === 'Delivered') {
      setSelectedOrder(order);
      setIsReversalModalOpen(true);
    } else {
      setReversalMessage('Order has not been delivered yet.');
      setTimeout(() => setReversalMessage(''), 3000);
    }
  };

  const closeReversalModal = () => {
    setIsReversalModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const logOut = () => navigate('/login');

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        {sidebarVisible && (
          <div className="col-md-2 sidebar bg-dark text-white vh-100 p-3">
            <div className="user-info text-center">
              <img
                src="https://th.bing.com/th?id=OIP.Q9rsZpd4tcVdZAmeChgtXAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
                alt="User Logo"
                className="user-logo img-fluid rounded-circle mb-3"
              />
              <h5>Welcome, {userName}</h5>
              <p>{mobileNumber}</p>
              <hr />
            </div>
            <nav className="nav flex-column">
              <button className="btn btn-primary mb-2" onClick={openModal}>
                Add Order
              </button>
              <button className="btn btn-primary mb-2">Remove Order</button>
              <button className="btn btn-primary mb-2" onClick={handleForwardOrderClick}>
                View Orders
              </button>
            </nav>
            <button className="btn btn-danger mt-auto" onClick={logOut}>
              Logout
            </button>
          </div>
        )}
        <div className={`col ${sidebarVisible ? 'col-md-10' : 'col-12'} main-content`}>
          <div className="header bg-dark text-white p-3 d-flex justify-content-between">
            <button className="btn btn-light d-md-none" onClick={toggleSidebar}>
              {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
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
                    <div className="spinner-border text-primary" role="status" />
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
                      <tr key={index}>
                        <td>{order?.order_date || 'N/A'}</td>
                        <td>{order?.material_name || 'N/A'}</td>
                        <td>{order?.model || 'N/A'}</td>
                        <td>{order?.name_of_customer || 'N/A'}</td>
                        <td>{order?.status || 'N/A'}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => openReversalModal(order)}
                            disabled={order?.status !== 'Delivered'}
                          >
                            Raise Reversal
                          </button>
                        </td>
                      </tr>
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
        <RaiseReversalModal
          isModalOpen={isReversalModalOpen}
          closeModal={closeReversalModal}
          order={selectedOrder}
        />
      )}
      {reversalMessage && (
        <div className="reversal-message-overlay">
          <div className="reversal-message-dialog">
            <h5>Notice</h5>
            <p>{reversalMessage}</p>
            <button type="button" className="btn btn-primary" onClick={() => setReversalMessage('')}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
