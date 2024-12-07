import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AddOrderModal from './AddOrderModal';
import RaiseReversalModal from './RaiseReversalModal';
import LoadingDialog from './LoadingDialog';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PODashboard.css'; // Import the CSS file
import ManageSupplierModal from './ManageSupplierModal';
import RaisePOModal from './RaisePOModal';
import MarkDeliverModal from './MarkDeliverModal'; // Import the MarkDeliverModal component
import DcDeliverModal from './DcDeliverModal'; // Import the DcDeliverModal component


const PODashboard = () => {
  
  
  
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [isManageSupplierModalOpen, setIsManageSupplierModalOpen] = useState(false); 
  
  const [isRaisePOModalOpen, setIsRaisePOModalOpen] = useState(false);
  const [isMarkDeliverModalOpen, setIsMarkDeliverModalOpen] = useState(false); // Mark Deliver Modal state
  const [isDcDeliverModalOpen, setIsDcDeliverModalOpen] = useState(false); // DC Deliver Modal state
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [responseMessage, setResponseMessage] = useState(''); // Response message for actions
  const [currentView, setCurrentView] = useState(''); // Track the current view
  const { role, token, mobileNumber, userName } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reversalMessage, setReversalMessage] = useState('');
  const [activeSection, setActiveSection] = useState('forward');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orderType, setOrderType] = useState('forward orders');
  const [columns, setColumns] = useState([]); // State to manage columns
  const navigate = useNavigate();

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
  const forwardOrderColumns = [
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Customer Name', accessor: 'name_of_customer' },
    { header: 'Status', accessor: 'status' },
    { header: 'Action', accessor: 'actions', isButton: true, buttonText: 'Raise Reversal' }
  ];

  const reversalOrderColumns = [
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Material Name', accessor: 'original_order_material_name' },
    { header: 'Supplier Name', accessor: 'origin_order_supplier_name' },
    { header: 'Description', accessor: 'description' },
    { header: 'original_order_quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'DC Number', accessor: 'dc_number' }
  ];
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
  const handleViewOrdersClick = () => {
    setActiveSection('forward');
    setOrderType('Forward Orders');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`, forwardOrderColumns);
  };
  const handleAddOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleForwardOrderClick = () => {
    setOrderType('forward orders');
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`, forwardOrderColumns);
  };

  const handleReversalOrderClick = () => {
    setOrderType('reversal orders');
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_orders/${mobileNumber}`, reversalOrderColumns);
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
    setSidebarVisible(!sidebarVisible);
  };

  const logOut = () => navigate('/login');

  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  const handleSwitch = (orderType) => {
    switch (orderType) {
      case 'Forward Orders':
        handleForwardOrderClick();
        break;
      case 'Reversal Orders':
        handleReversalOrderClick();
        break;
      default:
        console.log('Unknown action');
    }
  };
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
      <Sidebar
        role={role}
        onCollapseToggle={handleSidebarToggle}
        onViewOrdersClick={handleViewOrdersClick}
        onAddOrderClick={handleAddOrderClick}
        onReviewPendingClick={handleReversalOrderClick}
        onLogout={logOut}
      />
    </div>
  );
};

export default PODashboard;