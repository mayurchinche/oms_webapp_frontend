import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import {
  FaClipboardList,
  FaBoxOpen,
  FaCogs,
  FaChartBar,
  FaTasks,
  FaSignOutAlt,
  FaTruck,
  FaUserTie,
  FaPaperPlane,
  FaShippingFast,
  FaBox,
  FaUserCircle,
} from 'react-icons/fa';

// Mapping button names to their corresponding icons
const iconMapping = {
  'View Orders': <FaClipboardList />,
  'Add Order': <FaBoxOpen />,
  'Manage Materials': <FaCogs />,
  'Manage Suppliers': <FaUserTie />,
  'Review Pending': <FaTasks />,
  'Reversal Review Pending': <FaTasks />,
  'Analysis': <FaChartBar />,
  'Raise PO': <FaPaperPlane />,
  'Raise DC': <FaShippingFast />,
  'Mark Delivery': <FaTruck />,
  'Mark Reversal Delivery': <FaBox />,
};


// Function to fetch menu items based on user role
const getMenuItems = (role) => {
  switch (role) {
    case 'manager':
      return [
        'View Orders',
        'Add Order',
        'Manage Materials',
        'Manage Suppliers',
        'Reversal Review Pending',
        'Review Pending',
        'Analysis',
      ];
    case 'po_team':
      return [
        'View Orders',
        'Add Order',
        'Raise PO',
        'Raise DC',
        'Mark Delivery',
        'Mark Reversal Delivery',
        'Manage Suppliers',
      ];
    case 'employee':
    default:
      return ['View Orders', 'Add Order'];
  }
};

const Sidebar = ({ onCollapseToggle, role, onViewOrdersClick, onAddOrderClick, onManageMaterailClick, onManageSupplierClick, onReviewPendingClick,onReversalReviewPendingClick,onAnalysisClick, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseToggle(!isCollapsed);
  };
  const { mobileNumber, userName } = useSelector((state) => state.auth);
  const menuItems = getMenuItems(role);

  return (
    <div className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* User Info Section */}
      <div className="sidebar-user-info">
        <FaUserCircle className="sidebar-user-icon" />
        {!isCollapsed && (
          <>
            <p className="sidebar-username">{userName}</p>
            <p className="sidebar-contact-number">{mobileNumber}</p>
          </>
        )}
      </div>
      <div className="sidebar-separator"></div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu">
        {/* ORDER Group */}
        {menuItems.includes('View Orders') || menuItems.includes('Add Order') ? (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">ORDER</p>
            {['View Orders', 'Add Order'].map(
              (item, index) =>
                menuItems.includes(item) && (
                  <div
                    className="sidebar-item"
                    key={index}
                    onClick={() => {
                      if (item === 'View Orders' && onViewOrdersClick) onViewOrdersClick();
                      if (item === 'Add Order' && onAddOrderClick) onAddOrderClick();
                    }}
                  >
                    {iconMapping[item]} <span>{item}</span>
                  </div>
                )
            )}
          </div>
        ) : null}

        <div className="sidebar-divider" />

        {/* MANAGEMENT Group */}
        {menuItems.some((item) => ['Manage Materials', 'Manage Suppliers'].includes(item)) && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">MANAGEMENT</p>
            {['Manage Materials', 'Manage Suppliers'].map(
              (item, index) =>
                menuItems.includes(item) && (
                  <div className="sidebar-item" key={index}
                  onClick={() => {
                    if (item === 'Manage Materials' && onManageMaterailClick) onManageMaterailClick();
                    if (item === 'Manage Suppliers' && onManageSupplierClick) onManageSupplierClick();
                    
                  }}>
                    {iconMapping[item]} <span>{item}</span>
                  </div>
                )
            )}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* REVIEW ACTION Group */}
        {menuItems.includes('Review Pending','Reversal Review Pending') && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">REVIEW ACTION</p>
            {['Review Pending', 'Reversal Review Pending'].map((item, index) => 
            menuItems.includes(item) && (
              <div className="sidebar-item" key={index}
              onClick={() => {
                if (item === 'Review Pending' && onReviewPendingClick) onReviewPendingClick();
                if (item === 'Reversal Review Pending' && onReversalReviewPendingClick) onReversalReviewPendingClick();
              }}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            )
            )}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* DELIVERY ACTIONS Group */}
        {menuItems.some((item) => ['Raise PO', 'Raise DC', 'Mark Delivery', 'Mark Reversal Delivery'].includes(item)) && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">DELIVERY ACTIONS</p>
            {['Raise PO', 'Raise DC', 'Mark Delivery', 'Mark Reversal Delivery'].map(
              (item, index) =>
                menuItems.includes(item) && (
                  <div className="sidebar-item" key={index}>
                    {iconMapping[item]} <span>{item}</span>
                  </div>
                )
            )}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* ANALYSIS Group */}
        {menuItems.includes('Analysis') && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">ANALYSIS</p>
            {['Analysis'].map((item, index) => (
              <div className="sidebar-item" key={index} onClick={onAnalysisClick}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button */}
        <button className="sidebar-logout-btn" onClick={onLogout}>
          Logout <FaSignOutAlt />
        </button>
      </div>

      {/* Sidebar Toggle Button */}
      <div className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </div>
    </div>
  );
};

export default Sidebar;
