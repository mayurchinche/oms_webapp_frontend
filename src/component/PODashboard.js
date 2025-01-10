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
import RaiseDcModal from './RaiseDcModal';
import { logout } from '../redux/Actions/authActions';
import { useDispatch } from 'react-redux';
import ManageMaterialModal from './ManageMaterialModal'; // Import the ManageMaterialModal component

import ApproveOrderModal from './ApproveOrderModal';
import ApproveReversalOrderModal from './ApproveReversalOrderModal';

import { FaFilter } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap'; // For dropdown menus

const PODashboard = () => {
  
  
  const dispatch = useDispatch();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [isManageSupplierModalOpen, setIsManageSupplierModalOpen] = useState(false); 
  
  const [isRaisePOModalOpen, setIsRaisePOModalOpen] = useState(false);
  const [isMarkDeliverModalOpen, setIsMarkDeliverModalOpen] = useState(false); // Mark Deliver Modal state
  const [isDcDeliverModalOpen, setIsDcDeliverModalOpen] = useState(false); // DC Deliver Modal state

  const [isRaiseDCModel, setIsRaiseDCModel] = useState(false); // DC Deliver Modal state

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
  const handleReveiwPendingClick=()=>{
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/review_pending',reviewPendingColumns);
  }
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
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // Approve Modal state
  const [isApproveReversalOrderModal, setIsApproveReversalOrderModal] = useState(false); // Approve Reversal Modal state
  const handleReversalReveiwPendingClick = () => {
    fetchOrders(' https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_reversal_review_pending',reversalReviewPendingColumns);
  };


  const closeApproveModal = () => {
    console.log('Closing approve modal');
    setIsApproveModalOpen(false);
  };

  const closeApproveReversalModal =(order) =>{
    console.log('Opening approve reversal modal for order:', order);
    setIsApproveReversalOrderModal(false);
  }


  const [isManageMaterialModalOpen, setIsManageMaterialModalOpen] = useState(false); // Manage Material Modal state
  const openManageMaterialModal = () => {
    console.log('Opening manage material modal');
    setIsManageMaterialModalOpen(true);
  };


  const closeManageMaterialModal = () => {
    console.log('Closing manage material modal');
    setIsManageMaterialModalOpen(false);
  };


  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD' format
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
  const forwardOrderColumns = [
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Material Code', accessor: 'material_code' },
    { header: 'Model', accessor: 'model' },
    { header: 'Customer Name', accessor: 'name_of_customer' },
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
  const pendingPOColumns = [
    { header: 'Order Date', accessor: 'order_date' },
    { header: 'Name of Customer', accessor: 'name_of_customer' },
    { header: 'Material Name', accessor: 'material_name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Order Quantity', accessor: 'order_quantity' },
    { header: 'Ordered By', accessor: 'ordered_by' },
    { header: 'Approved By', accessor: 'approved_by' },
    { header: 'Note', accessor: 'note' },
    { header: 'Expected Price', accessor: 'expected_price' },
    { header: 'Action', accessor: 'Raise PO', isButton: true, buttonText: 'Raise PO' }
  ];

  const dcPendingColumns = [

    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Description', accessor: 'description' },
    { header: 'Original Order ID', accessor: 'original_order_id' },
    { header: 'Original Order Material Name', accessor: 'original_order_material_name' },
    { header: 'Original Order Quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'Raise DC', accessor: 'Raise DC', isButton: true, buttonText: 'Raise DC' }
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
    { header: 'Mark Deliver', accessor: 'Mark Delivery', isButton: true, buttonText: 'Mark Delivery' }
  ];

  const reversalDeliveryPendingColumns = [
    { header: 'Reversal Order ID', accessor: 'id' },
    { header: 'DC Number', accessor: 'dc_number' },
    { header: 'User Contact Number', accessor: 'user_contact_number' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Description', accessor: 'description' },
    { header: 'Original Order ID', accessor: 'original_order_id' },
    { header: 'Original Order Material Name', accessor: 'original_order_material_name' },
    { header: 'Original Order Quantity', accessor: 'original_order_quantity' },
    { header: 'Reversal Quantity', accessor: 'reversal_quantity' },
    { header: 'Status', accessor: 'status' },
    { header: 'DC Deliver', accessor: 'DC Deliver', isButton: true, buttonText: 'DC Deliver' }
  ];
  const [filters, setFilters] = useState({});
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };
  const clearAllFilters = () => {
    setFilters({
      state: '',
      ordered_by: '',
      order_date: '',
      material_name: '',
      material_code: '',
      po_no:'',
      dc_number:''
    });
  };
    
  const filteredOrders = orders.filter((order) => {
    return Object.entries(filters).every(([column, value]) => {
      return !value || order[column] === value;
    });
  });
  
  
const handleReversalOrderViewClick = () => {
    clearAllFilters();
    setOrderType('reversal orders');
    setActiveSection('reversal');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_all_reversal_orders`, reversalOrderColumns);
  };

  const handleForwardOrderViewClick = () => {
    setActiveSection('forward');
    setOrderType('Forward Orders');
    fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/get_all_orders`, forwardOrderColumns);
  };


  const handelRaisePOClick = () =>{
    handleForwardOrderClick()
  }

  const handelRaiseDCButtonClick =(order) =>
  {
    console.log("handelRaiseDCButtonClick",order)
    openRaiseDCModal(order)
  }
  const handelRaiseDCClick = () =>{
    handleReversalOrderClick()
  }

  const handelMarkDeliveryClick = () =>{
    handleDeliveryPendingClick()
  }

  const handelMarkDeliveryButtonClick =(order)=>{
    console.log("handelMarkDeliveryButtonClick",order)
    openMarkDeliverModal(order)
  }
  const handelDCDevliveryButtonClick= (order) =>
  {
    console.log("handelDCDevliveryButtonClick",order)
    openDcDeliverModal(order);
  }

  const handelMarkReversalDeliveryClick = ()=>{
    handleReversalOrdersClick()
  }

  const handelRaisePOButtonClick =(order)=>{
    openRaisePOModal(order);
    handelRaisePOClick()
  }

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
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/get_po_pending_orders', pendingPOColumns, 'pendingPO');
  };

  const handleReversalOrderClick = () => {
    setOrderType('reversal orders');
    setActiveSection('reversal');
    fetchOrders('https://ordermanagementservice-backend.onrender.com/api/core/orders/reversal/get_dc_pending', dcPendingColumns, 'dcPending');
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
  const handelManageSupplierClick=()=>{
    openManageSupplierModal()
  }

  const closeReversalModal = () => {
    setIsReversalModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

    const logOut = () =>
    {
      dispatch(logout());
      navigate('/login');
    }

  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
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

  const openRaisePOModal = (order) => {
    setSelectedOrder(order);
    setIsRaisePOModalOpen(true);
  };

  const closeRaisePOModal = () => {
    setIsRaisePOModalOpen(false);
  };

  const openMarkDeliverModal = (order) => {
    setSelectedOrder(order);
    console.log("Marking delivery")
    setIsMarkDeliverModalOpen(true);
    console.log("Marking delivery Successful")
  };

  const closeMarkDeliverModal = () => {
    setIsMarkDeliverModalOpen(false);
  };

  const openDcDeliverModal = (order) => {
    setSelectedOrder(order);
    setIsDcDeliverModalOpen(true);
  };

  const closeDcDeliverModal = () => {
    setIsDcDeliverModalOpen(false);
  };
  
  const openRaiseDCModal= (order) => {
    setSelectedOrder(order);
    setIsRaiseDCModel(true);
  };

  const closeDRaisecDCModal = () => {
    setIsRaiseDCModel(false);
  };
  

  const raiseDC = (orderId) => {
    console.log("On raise DC")
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
  // const handleSwitch = (orderType) => {
  //   switch (orderType) {
  //     case 'Forward Orders':
  //       handleForwardOrderClick();
  //       break;
  //     case 'Reversal Orders':
  //       handleReversalOrderClick();
  //       break;
  //     default:
  //       console.log('Unknown action');
  //   }
  // };
  const handleSwitch = (orderType) => {
    switch (orderType) {
      case 'Forward Orders':
        handleForwardOrderViewClick()
        break;
      case 'Reversal Orders':
        handleReversalOrderViewClick()
        break;
      default:
        console.log('Unknown action');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        role={role}
        onCollapseToggle={handleSidebarToggle}
        onRaisePOClick={handelRaisePOClick}
        onRaiseDCClick={handelRaiseDCClick}
        onMarkDeliveryClick={handelMarkDeliveryClick}
        onMarkReversalDeliveryClick={handelMarkReversalDeliveryClick}
        onViewOrdersClick={handleForwardOrderViewClick}
        onAddOrderClick={handleAddOrderClick}
        onReviewPendingClick={handleReveiwPendingClick}
        onManageSupplierClick={handelManageSupplierClick}
        onManageMaterailClick={openManageMaterialModal}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{column.header}</span>
          
          {/* Show selected filter value if it exists */}
          {['status', 'ordered_by', 'order_date', 'material_name','material_code','po_no','dc_number'].includes(column.accessor) && filters[column.accessor] && (
            <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f1f1f1',
              color: '#333',
              padding: '2px 6px', // Reduced padding
              fontSize: '12px', // Smaller font size
              borderRadius: '10px',
              marginLeft: '8px',
              height: '18px', // Limit height for compactness
              lineHeight: '16px', // Adjust line height to make text align better
              whiteSpace: 'nowrap', // Prevent wrapping
            }}
          >
            {filters[column.accessor]}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#f44336',
                cursor: 'pointer',
                marginLeft: '4px', // Smaller margin
                fontSize: '12px', // Reduce font size for the close icon
              }}
              onClick={() => handleFilterChange(column.accessor, '')} // Clear filter
            >
              x
            </button>
          </span>
          
          )}

          {/* Filter Dropdown */}
          {['status', 'ordered_by', 'order_date', 'material_name','material_code','po_no','dc_number'].includes(column.accessor) && (
            <DropdownButton
              id={`filter-${column.accessor}`}
              title={<FaFilter style={{ cursor: 'pointer', color: '#fff' }} />}
              variant="secondary"
              size="sm"
              onSelect={(value) => handleFilterChange(column.accessor, value)}
            >
              <Dropdown.Item eventKey="">All</Dropdown.Item>
              {[...new Set(orders.map((order) => order[column.accessor]))].map((value) => (
                <Dropdown.Item key={value} eventKey={value}>
                  {value}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          )}
        </div>
      </th>
    ))}
  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={index}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                        {column.isButton ? (
                          <button onClick={() => {
                            if (column.accessor === 'Raise DC') {
                              handelRaiseDCButtonClick(order)
                              // raiseDC(order.id);
                            } else if (column.accessor === 'Raise PO') {
                              handelRaisePOButtonClick(order)
                              
                            } else if (column.accessor === 'Mark Delivery') {
                            
                              handelMarkDeliveryButtonClick(order)
                              
                            } else if (column.accessor === 'DC Deliver') {

                              handelDCDevliveryButtonClick(order)
                              
                            }
                          }}>
                            {column.buttonText}
                          </button>
                        ) : column.accessor === 'created_at' ? (
                          formatDate(order[column.accessor]) // Format the date here
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
        <ManageMaterialModal isModalOpen={isManageMaterialModalOpen} closeModal={closeManageMaterialModal} />
        <ManageSupplierModal  isModalOpen={isManageSupplierModalOpen} closeModal ={closeManageSupplierModal} />
        {selectedOrder && <RaisePOModal isModalOpen={isRaisePOModalOpen} closeModal ={closeRaisePOModal} order={selectedOrder} fetchOrders={fetchOrders} pendingPOColumns={pendingPOColumns} />}
        {selectedOrder && <MarkDeliverModal isModalOpen={isMarkDeliverModalOpen} closeModal ={closeMarkDeliverModal} order={selectedOrder} fetchOrders={fetchOrders} deliveryPendingColumns={deliveryPendingColumns} />}
        {selectedOrder && <DcDeliverModal isModalOpen={isDcDeliverModalOpen} closeModal ={closeDcDeliverModal} order={selectedOrder} reversalDeliveryPendingColumns={reversalDeliveryPendingColumns} fetchOrders={fetchOrders} />}
        {selectedOrder && <RaiseDcModal isModalOpen={isRaiseDCModel} closeModal ={closeDRaisecDCModal} order={selectedOrder} fetchOrders={fetchOrders} dcPendingColumns={dcPendingColumns}  />}
        {selectedOrder && <ApproveOrderModal isModalOpen={isApproveModalOpen} closeModal={closeApproveModal} order={selectedOrder} />}
        {selectedOrder && <ApproveReversalOrderModal isModalOpen={isApproveReversalOrderModal} closeModal={closeApproveReversalModal} order={selectedOrder} />}
 
        
        {/* <RaisePOModal isModalOpen={isRaisePOModalOpen} closeModal ={openRaisePOModal} order  /> */}
        </div>
    </div>
  );
};

export default PODashboard;