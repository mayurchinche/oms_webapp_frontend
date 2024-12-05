import React, { useState, useEffect,useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddOrderModal from './AddOrderModal';
import RaiseReversalModal from './RaiseReversalModal';
import { useNavigate } from 'react-router-dom';
import LoadingDialog from './LoadingDialog';
import './NewManagerDahsboard.css';

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
  const [orderType, SetOrderType] =  useState('forward orders');
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

  console.log('order data',orders);

  useEffect(() => {
    if (mobileNumber && token && role) {
      fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
    }
  }, [mobileNumber, token, role, fetchOrders]);

  // Handlers for the sidebar buttons
  const handleViewOrdersClick = () => {
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
  };

const handleAddOrderClick = () => {
    setIsModalOpen(true);
  };
  const handleForwardOrderClick = () => {
    console.log('Forward Order clicked');
    SetOrderType('forward orders')
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`);
  };

  const handleReversalOrderClick = () => {
    SetOrderType('reversal orders')
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_orders/${mobileNumber}`);
  };

  const openReversalModal = (order) => {
    if (order.status === 'Order_Delivered') {
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

  const toggleSidebar = () => {
    // Only toggle visibility for mobile screen (on smaller screens)
    setSidebarVisible(!sidebarVisible);
  };

  const logOut = () => navigate('/login');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '80px' : '250px'
    );
  };

  const handleSwitch = (orderType) => {
    switch (orderType) {

      case 'Forward Orders':
        // Handle Forward Orders action
        handleForwardOrderClick()
        console.log('Forward Orders action triggered');
        break;
      case 'Reversal Orders':
        handleReversalOrderClick()
        console.log('Reversal Orders action triggered');
        break;
      default:
        console.log('Unknown action');
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isSidebarCollapsed ? '80px' : '250px'
    );
  }, [isSidebarCollapsed]);

  return (
    <div className="dashboard-container">
      <Sidebar role={role} onCollapseToggle={handleSidebarToggle} 
              onViewOrdersClick={handleViewOrdersClick}
              onAddOrderClick={handleAddOrderClick}
              onReviewPendingClick={handleReversalOrderClick}
              onLogout={logOut}/>
      
      <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
        <Header onSwitch={handleSwitch} />

          <div style={{marginTop :'30px', marginLeft:'20px'}}><h3>
            You are veiwing {orderType}
          </h3></div>

              <div>
               <div className="table-container">
                    <div>
              {loading ? (
                <LoadingDialog open={loading} />
              ) : error ? (
                <div>{error}</div>
              ) : (

                      <table className="table table-bordered table-hover custom-table">
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', color: 'black', zIndex: 1 }}>
          <tr>
            <th style={{ padding: '12px 8px', backgroundColor:'#007bff',color:'white' }}>Order Date</th>
            <th style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white' }}>Material Name</th>
            <th style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white' }}>Model</th>
            <th style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white'}}>Customer Name</th>
            <th style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white' }}>Status</th>
            <th style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white' }}>Action</th>
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
                                  <button  style={{ backgroundColor: '#085fbc'}}
                                    onClick={() => openReversalModal(order)}
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
                       )}
                       </div>
                    </div>
                       
               
              </div>
              
      </div>
      <AddOrderModal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
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