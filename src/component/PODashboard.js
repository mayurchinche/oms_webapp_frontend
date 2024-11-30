import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './PODashboard.css'; // Import the CSS file
import ManageSupplierModal from './ManageSupplierModal';
import RaisePOModal from './RaisePOModal';
import MarkDeliverModal from './MarkDeliverModal'; // Import the MarkDeliverModal component
import DcDeliverModal from './DcDeliverModal'; // Import the DcDeliverModal component

const PODashboard = () => {
  const userName = "John Doe"; // Example user name
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [columns, setColumns] = useState([]); // State to manage columns
  const [isManageSupplierModalOpen, setIsManageSupplierModalOpen] = useState(false); 
  const { role, token } = useSelector((state) => state.auth);
  const [isRaisePOModalOpen, setIsRaisePOModalOpen] = useState(false);
  const [isMarkDeliverModalOpen, setIsMarkDeliverModalOpen] = useState(false); // Mark Deliver Modal state
  const [isDcDeliverModalOpen, setIsDcDeliverModalOpen] = useState(false); // DC Deliver Modal state
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [responseMessage, setResponseMessage] = useState(''); // Response message for actions
  const [currentView, setCurrentView] = useState(''); // Track the current view

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchOrders = (url, columnsConfig, view) => {
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
          setColumns(columnsConfig); // Set the columns configuration
          setCurrentView(view); // Set the current view
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
      fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/get_po_pending_orders', pendingPOColumns, 'pendingPO');
    }
  }, [token, role]);

  const pendingPOColumns = [
    { header: 'Order ID', accessor: 'order_id' },
    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Name of Customer', accessor: 'name_of_customer' },
    { header: 'PO No', accessor: 'po_no' },
    { header: 'Whatsapp Date', accessor: 'whatsapp_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Order Quantity', accessor: 'order_quantity' },
    { header: 'Order To', accessor: 'order_to' },
    { header: 'Received Date', accessor: 'received_date' },
    { header: 'Pending Quantity', accessor: 'pending_quantity' },
    { header: 'Ordered By', accessor: 'ordered_by' },
    { header: 'Approved By', accessor: 'approved_by' },
    { header: 'PO Raised By', accessor: 'po_raised_by' },
    { header: 'Status', accessor: 'status' },
    { header: 'Note', accessor: 'note' },
    { header: 'Expected Price', accessor: 'expected_price' },
    { header: 'Ordered Price', accessor: 'ordered_price' },
    { header: 'Supplier Name', accessor: 'supplier_name' },
    { header: 'Action', accessor: 'actions', isButton: true, buttonText: 'Raise PO' }
  ];

  const dcPendingColumns = [
    { header: 'Reversal Order ID', accessor: 'id' },
    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Description', accessor: 'description' },
    { header: 'Original Order ID', accessor: 'original_order_id' },
    { header: 'Original Order Material Name', accessor: 'original_order_material_name' },
    { header: 'Original Order Quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'Raise DC', accessor: 'raise_dc', isButton: true, buttonText: 'Raise DC' }
  ];

  const deliveryPendingColumns = [
    { header: 'Order ID', accessor: 'order_id' },
    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Name of Customer', accessor: 'name_of_customer' },
    { header: 'PO No', accessor: 'po_no' },
    { header: 'Whatsapp Date', accessor: 'whatsapp_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Order Quantity', accessor: 'order_quantity' },
    { header: 'Order To', accessor: 'order_to' },
    { header: 'Received Date', accessor: 'received_date' },
    { header: 'Pending Quantity', accessor: 'pending_quantity' },
    { header: 'Ordered By', accessor: 'ordered_by' },
    { header: 'Approved By', accessor: 'approved_by' },
    { header: 'PO Raised By', accessor: 'po_raised_by' },
    { header: 'Status', accessor: 'status' },
    { header: 'Note', accessor: 'note' },
    { header: 'Expected Price', accessor: 'expected_price' },
    { header: 'Ordered Price', accessor: 'ordered_price' },
    { header: 'Supplier Name', accessor: 'supplier_name' },
    { header: 'Raise DC', accessor: 'raise_dc', isButton: true, buttonText: 'Raise DC' },
    { header: 'Mark Deliver', accessor: 'mark_deliver', isButton: true, buttonText: 'Mark Deliver' }
  ];

  const reversalDeliveryPendingColumns = [
    { header: 'Reversal Order ID', accessor: 'id' },
    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Description', accessor: 'description' },
    { header: 'Original Order ID', accessor: 'original_order_id' },
    { header: 'Original Order Material Name', accessor: 'original_order_material_name' },
    { header: 'Original Order Quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'DC Deliver', accessor: 'dc_deliver', isButton: true, buttonText: 'DC Deliver' }
  ];

  const handlePendingOrdersClick = () => {
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/get_po_pending_orders', pendingPOColumns, 'pendingPO');
  };

  const handleDCPendingClick = () => {
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_dc_pending', dcPendingColumns, 'dcPending');
  };

  const handleDeliveryPendingClick = () => {
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/get_delivery_pending_orders', deliveryPendingColumns, 'deliveryPending');
  };

  const handleReversalOrdersClick = () => {
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_delivery_pending_orders', reversalDeliveryPendingColumns, 'reversalPending');
  };

  const handleDcDeliveryPendingClick = () => {
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_delivery_pending_orders', reversalDeliveryPendingColumns, 'dcDeliveryPending');
  };

  const openManageSupplierModal = () => {
    setIsManageSupplierModalOpen(true);
  };

  const closeManageSupplierModal = () => {
    setIsManageSupplierModalOpen(false);
  };

  const openRaisePOModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsRaisePOModalOpen(true);
  };

  const closeRaisePOModal = () => {
    setIsRaisePOModalOpen(false);
  };

  const openMarkDeliverModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsMarkDeliverModalOpen(true);
  };

  const closeMarkDeliverModal = () => {
    setIsMarkDeliverModalOpen(false);
  };

  const openDcDeliverModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDcDeliverModalOpen(true);
  };

  const closeDcDeliverModal = () => {
    setIsDcDeliverModalOpen(false);
  };

  const raiseDC = (orderId) => {
    const dcData = {
      dc_number: orderId
    };

    console.log('Raising DC with data:', dcData);

    axios.put(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/submit_dc_for_reversal/${orderId}`, dcData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('DC raised:', response.data);
        if (response.status === 200) {
          setResponseMessage('DC raised successfully');
        } else {
          setResponseMessage('Failed to raise DC');
        }
        setTimeout(() => {
          setResponseMessage('');
          fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_dc_pending', dcPendingColumns, 'dcPending');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to raise DC', err);
        setResponseMessage('Failed to raise DC');
      });
  };

  const dcDeliver = (orderId, deliveredAt) => {
    const deliveryData = {
      delivered_at: deliveredAt
    };

    console.log('DC Delivering with data:', deliveryData);

    axios.put(`https://ordermanagementservice-backend.onrender.com/api/core/orders/revrsal/delivery/${orderId}`, deliveryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('DC delivered:', response.data);
        if (response.status === 200) {
          setResponseMessage('DC marked as delivered successfully');
        } else {
          setResponseMessage('Failed to mark DC as delivered');
        }
        setTimeout(() => {
          setResponseMessage('');
          fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_delivery_pending_orders', reversalDeliveryPendingColumns, 'dcDeliveryPending');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to mark DC as delivered', err);
        setResponseMessage('Failed to mark DC as delivered');
      });
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
          <h2>{userName}</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-button" onClick={handlePendingOrdersClick}>Pending PO</button>
          <button className="sidebar-button" onClick={handleDCPendingClick}>DC Pending</button>
          <button className="sidebar-button" onClick={handleDeliveryPendingClick}>Delivery Pending</button>
          <button className="sidebar-button" onClick={handleDcDeliveryPendingClick}>DC Delivery Pending</button>
          <button className="sidebar-button" onClick={openManageSupplierModal}>Manage Supplier</button>
          {/* Add more buttons as needed */}
        </nav>
      </aside>
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="header">
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <div className="header-section" onClick={handlePendingOrdersClick}>Forward Orders</div>
          <div className="header-section" onClick={handleReversalOrdersClick}>Reversal Orders</div>
        </header>
        <section className="content-area">
          {error ? (
            <div>{error}</div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column.isButton ? (
                            <button onClick={() => {
                              if (column.accessor === 'raise_dc') {
                                raiseDC(order.id);
                              } else if (column.accessor === 'actions') {
                                openRaisePOModal(order.order_id);
                              } else if (column.accessor === 'mark_deliver') {
                                openMarkDeliverModal(order.order_id);
                              } else if (column.accessor === 'dc_deliver') {
                                openDcDeliverModal(order.id);
                              }
                            }}>
                              {column.buttonText}
                            </button>
                          ) : (
                            order[column.accessor]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {responseMessage && <div className="response-message">{responseMessage}</div>}
      <ManageSupplierModal isModalOpen={isManageSupplierModalOpen} closeModal={closeManageSupplierModal} />
      <RaisePOModal isModalOpen={isRaisePOModalOpen} closeModal={closeRaisePOModal} orderId={selectedOrderId} userName={userName} />
      <MarkDeliverModal isModalOpen={isMarkDeliverModalOpen} closeModal={closeMarkDeliverModal} orderId={selectedOrderId} />
      <DcDeliverModal isModalOpen={isDcDeliverModalOpen} closeModal={closeDcDeliverModal} orderId={selectedOrderId} dcDeliver={dcDeliver} />
    </div>
  );
};

export default PODashboard;