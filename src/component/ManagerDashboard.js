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
import ManageMaterialModal from './ManageMaterialModal'; // Import the ManageMaterialModal component
import ManageSupplierModal from './ManageSupplierModal'; // Import the ManageSupplierModal component
import ApproveOrderModal from './ApproveOrderModal';
import ApproveReversalOrderModal from './ApproveReversalOrderModal';
import './NewManagerDahsboard.css';

const ManagerDashboard = () => {
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
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // Approve Modal state
  const [isApproveReversalOrderModal, setIsApproveReversalOrderModal] = useState(false); // Approve Reversal Modal state
  const [isManageMaterialModalOpen, setIsManageMaterialModalOpen] = useState(false); // Manage Material Modal state
  const [isManageSupplierModalOpen, setIsManageSupplierModalOpen] = useState(false); // Manage Supplier Modal state
  
  const forwardOrderColumns = [
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Customer Name', accessor: 'name_of_customer' },
    { header: 'Ordered By', accessor: 'ordered_by' },
    { header: 'Quantity', accessor: 'order_quantity' },
    { header: 'Status', accessor: 'status' }
    
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

  const reviewPendingColumns = [
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Customer Name', accessor: 'name_of_customer' },
    { header: 'Ordered By', accessor: 'ordered_by' },
    { header: 'Quantity', accessor: 'order_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'Action', accessor: 'Review & Approve', isButton: true, buttonText: 'Review & Approve' }

  ];
  
  const reversalReviewPendingColumns =[
    { header: 'Order Id', accessor: 'id' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Supplier Name', accessor: 'origin_order_supplier_name' },
    { header: 'Material Name', accessor: 'original_order_material_name' },
    { header: 'Customer Name', accessor: 'name_of_customer' },
    { header: 'Ordered By', accessor: 'user_contact_number' },
    { header: 'Quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Action', accessor: 'Approve Reversal', isButton: true, buttonText: 'Approve Reversal' }
  ]

  const fetchOrders = useCallback((url, columnsConfig) => {
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
          setColumns(columnsConfig); // Set the columns configuration
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
    setOrderType('forward orders')
    if (mobileNumber && token && role) {
      fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders`, forwardOrderColumns);
    }
  }, [mobileNumber, token, role, fetchOrders]);

  const handleReversalReveiwPendingClick = () => {
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_review_pending',reversalReviewPendingColumns);
  };

  const handleViewOrdersClick = () => {
    setActiveSection('forward');
    setOrderType('Forward Orders');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders`, forwardOrderColumns);
  };

  const handleAddOrderClick = () => {
    setIsModalOpen(true);
  };
const handelManageMaterailClick=()=>{
  openManageMaterialModal()
  }
const handelManageSupplierClick=()=>{
  openManageSupplierModal()
}

const handleReveiwPendingClick=()=>{
  fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/review_pending',reviewPendingColumns);
}
const handelAnalysisClick = () =>{
  console.log("Clicked handel Analysis")
  navigate('/dashboard');
}

  const handleForwardOrderClick = () => {
    setOrderType('forward orders');
    setActiveSection('forward');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders`, forwardOrderColumns);
  };

  const handleReversalOrderClick = () => {
    setOrderType('reversal orders');
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_all_reversal_orders`, reversalOrderColumns);
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
  
  const openApproveModal = (order) => {
    console.log('Opening approve modal for order:', order);
    setSelectedOrder(order);
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    console.log('Closing approve modal');
    setIsApproveModalOpen(false);
  };

  const openApproveReversalModal =(order) =>{
    console.log('Opening approve reversal modal for order:', order);
    setSelectedOrder(order);
    setIsApproveReversalOrderModal(true);
  }
  const closeApproveReversalModal =(order) =>{
    console.log('Opening approve reversal modal for order:', order);
    setIsApproveReversalOrderModal(false);
  }

  const openManageMaterialModal = () => {
    console.log('Opening manage material modal');
    setIsManageMaterialModalOpen(true);
  };

  const closeManageMaterialModal = () => {
    console.log('Closing manage material modal');
    setIsManageMaterialModalOpen(false);
  };

  const openManageSupplierModal = () => {
    console.log('Opening manage material modal');
    setIsManageSupplierModalOpen(true);
  };
  const closeManageSupplierModal = () => {
    console.log('Closing manage material modal');
    setIsManageSupplierModalOpen(false);
  };


  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        role={role}
        onCollapseToggle={handleSidebarToggle}
        onViewOrdersClick={handleViewOrdersClick}
        onAddOrderClick={handleAddOrderClick}
        onManageMaterailClick={openManageMaterialModal}
        onManageSupplierClick={handelManageSupplierClick}
        onReviewPendingClick={handleReveiwPendingClick}
        onAnalysisClick={handelAnalysisClick}
        onReversalReviewPendingClick={handleReversalReveiwPendingClick}
        onLogout={logOut}
      />
    
      <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
        <Header onSwitch={handleSwitch} isSidebarCollapsed={isSidebarCollapsed} />

        <div className={`header-caption ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <h3>You are viewing {orderType}</h3>
        </div>

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
                    {columns.map((column, index) => (
                      <th key={index} style={{ padding: '12px 8px', backgroundColor: '#007bff', color: 'white' }}>
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                        {column.isButton ? (
                          <button
                            style={{ backgroundColor: '#085fbc' }}
                            onClick={() =>{ 
                              {
                                if (column.accessor === 'Review & Approve') {
                                  openApproveModal(order)
                                } else if (column.accessor === 'Approve Reversal') {
                                  openApproveReversalModal(order);
                                }
                              }
                              }}
                          >
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
            )}
          </div>
        </div>

        <AddOrderModal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        

        <ManageMaterialModal isModalOpen={isManageMaterialModalOpen} closeModal={closeManageMaterialModal} />
        <ManageSupplierModal  isModalOpen={isManageSupplierModalOpen} closeModal ={openManageSupplierModal} />

        {selectedOrder && <ApproveOrderModal isModalOpen={isApproveModalOpen} closeModal={closeApproveModal} order={selectedOrder} />}
        {selectedOrder && <ApproveReversalOrderModal isModalOpen={isApproveReversalOrderModal} closeModal={closeApproveReversalModal} order={selectedOrder} />}
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
    </div>
  );
};

export default ManagerDashboard;

