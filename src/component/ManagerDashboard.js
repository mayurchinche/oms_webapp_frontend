import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ApproveOrderModal from './ApproveOrderModal'; // Import the ApproveOrderModal component
import ManageMaterialModal from './ManageMaterialModal'; // Import the ManageMaterialModal component
import './ManagerDashboard.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ManagerDashboard = () => {
  const userName = "John Doe"; // Example user name
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // Approve Modal state
  const [isManageMaterialModalOpen, setIsManageMaterialModalOpen] = useState(false); // Manage Material Modal state
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for approval

  const { role, token } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchOrders = (url) => {
    setLoading(true);
    setError(null);
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
          console.log(response.data[0].data); // Log the data array
        } else {
          setError('No records found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  };

 
  useEffect(() => {
    if (token && role) {
      fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders');
    }
  }, [token, role]);

  const handleReversalOrderClick = () => {
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_all_reversal_orders');
  };

  const handlePendingOrdersClick = () => {
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/review_pending');
  };

  const handleReversalPendingClick = () => {
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_review_pending');
  };

  const openApproveModal = (order) => {
    console.log('Opening approve modal for order:', order);
    setSelectedOrder(order);
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    console.log('Closing approve modal');
    setIsApproveModalOpen(false);
  };

  const openManageMaterialModal = () => {
    console.log('Opening manage material modal');
    setIsManageMaterialModalOpen(true);
  };

  const closeManageMaterialModal = () => {
    console.log('Closing manage material modal');
    setIsManageMaterialModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="user-info">
          <img src="path/to/user-image.jpg" alt="User" className="user-image" />
          <h2>{userName}</h2>
          <hr />
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-button" onClick={openManageMaterialModal}>Manage Material</button>
          <button className="sidebar-button" onClick={handlePendingOrdersClick}>Pending Orders</button>
          <button className="sidebar-button" onClick={handleReversalPendingClick}>Reversal Pending</button>
          <button className="sidebar-button" onClick={handleReversalOrderClick}>Reversal Orders</button>
          {/* Add more buttons as needed */}
        </nav>
      </aside>
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="header">
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <div className="header-section" onClick={() => fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders')}>All Orders</div>
          <div className="header-section" onClick={handleReversalOrderClick}>Reversal Orders</div>
        </header>
        <section className="content-area">
          {error ? (
            <div>{error}</div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User Contact Number</th>
                    <th>Order Date</th>
                    <th>Name of Customer</th>
                    <th>PO No</th>
                    <th>Whatsapp Date</th>
                    <th>Material Name</th>
                    <th>Model</th>
                    <th>Order Quantity</th>
                    <th>Order To</th>
                    <th>Received Date</th>
                    <th>Pending Quantity</th>
                    <th>Ordered By</th>
                    <th>Approved By</th>
                    <th>PO Raised By</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Expected Price</th>
                    <th>Ordered Price</th>
                    <th>Supplier Name</th>
                    <th>Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.order_id}</td>
                      <td>{order.user_contact_number}</td>
                      <td>{order.order_date}</td>
                      <td>{order.name_of_customer}</td>
                      <td>{order.po_no}</td>
                      <td>{order.whatsapp_date}</td>
                      <td>{order.material_name}</td>
                      <td>{order.model}</td>
                      <td>{order.order_quantity}</td>
                      <td>{order.order_to}</td>
                      <td>{order.received_date}</td>
                      <td>{order.pending_quantity}</td>
                      <td>{order.ordered_by}</td>
                      <td>{order.approved_by}</td>
                      <td>{order.po_raised_by}</td>
                      <td>{order.status}</td>
                      <td>{order.note}</td>
                      <td>{order.expected_price}</td>
                      <td>{order.ordered_price}</td>
                      <td>{order.supplier_name}</td>
                      <td><button onClick={() => openApproveModal(order)}>Approve</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {selectedOrder && <ApproveOrderModal isModalOpen={isApproveModalOpen} closeModal={closeApproveModal} order={selectedOrder} />}
      <ManageMaterialModal isModalOpen={isManageMaterialModalOpen} closeModal={closeManageMaterialModal} />
    </div>
  );
};

export default ManagerDashboard;



