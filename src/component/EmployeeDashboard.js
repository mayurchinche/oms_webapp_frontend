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
import { FaFilter } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap'; // For dropdown menus
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
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orderType, setOrderType] = useState('forward orders');
  const [columns, setColumns] = useState([]); // State to manage columns
  const navigate = useNavigate();


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
    });
  };
  
  const filteredOrders = orders.filter((order) => {
    return Object.entries(filters).every(([column, value]) => {
      return !value || order[column] === value;
    });
  });

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
      fetchOrders(`https://ordermanagementservice-backend.onrender.com/api/core/orders/ordered_by/${mobileNumber}`, forwardOrderColumns);
    }
  }, [mobileNumber, token, role, fetchOrders]);

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

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        role={role}
        onCollapseToggle={handleSidebarToggle}
        onViewOrdersClick={handleViewOrdersClick}
        onAddOrderClick={handleAddOrderClick}
        onReviewPendingClick={handleReversalOrderClick}
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
          {['status', 'ordered_by', 'order_date', 'material_name'].includes(column.accessor) && filters[column.accessor] && (
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
          {['status', 'ordered_by', 'order_date', 'material_name'].includes(column.accessor) && (
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
           <button
           style={{ backgroundColor: '#085fbc' }}
           onClick={() => openReversalModal(order)}
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

export default EmployeeDashboard;

