import React, { useState } from 'react';
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
  'Pending Reviews': <FaTasks />,
  'Reversal Pending Reviews': <FaSignOutAlt />,
  'Analysis': <FaChartBar />,
  'Raise PO': <FaPaperPlane />,
  'Mark Delivery': <FaTruck />,
  'Raise DC': <FaShippingFast />,
  'Mark Reversal Delivery': <FaBox />,
  'Manage Suppliers': <FaUserTie />,
};

// Function to fetch menu items based on user role
const getMenuItems = (role) => {
  switch (role) {
    case 'manager':
      return [
        'View Orders',
        'Add Order',
        'Manage Materials',
        'Pending Reviews',
        'Reversal Pending Reviews',
        'Analysis',
      ];
    case 'po_team':
      return [
        'View Orders',
        'Add Order',
        'Raise PO',
        'Mark Delivery',
        'Raise DC',
        'Mark Reversal Delivery',
        'Manage Suppliers',
      ];
    case 'employee':
    default:
      return ['View Orders', 'Add Order'];
  }
};

const Sidebar = ({ onCollapseToggle, role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseToggle(!isCollapsed);
  };

  const menuItems = getMenuItems(role);

  const handleLogout = () => {
    // Your logout logic here
    alert('Logged out');
  };

  return (
    <div className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* User Info Section */}
      <div className="sidebar-user-info">
        <FaUserCircle className="sidebar-user-icon" />
        {!isCollapsed && (
          <>
            <p className="sidebar-username">John Doe</p>
            <p className="sidebar-contact-number">+1 (123) 456-7890</p>
          </>
        )}
      </div>
      <div className="sidebar-separator"></div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu">
        {/* Order Management Group */}
        <div className="sidebar-item-group">
          <p className="sidebar-group-title">Order</p>
          {menuItems.slice(0, 2).map((item, index) => (
            <div className="sidebar-item" key={index}>
              {iconMapping[item]} <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-divider" />

        {/* Delivery Actions Group */}
        <div className="sidebar-item-group">
          <p className="sidebar-group-title">Delivery Actions</p>
          {menuItems.slice(2, 4).map((item, index) => (
            <div className="sidebar-item" key={index}>
              {iconMapping[item]} <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-divider" />

        {/* Review Actions Group */}
        <div className="sidebar-item-group">
          <p className="sidebar-group-title">Review Actions</p>
          {menuItems.slice(4).map((item, index) => (
            <div className="sidebar-item" key={index}>
              {iconMapping[item]} <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button className="sidebar-logout-btn" onClick={handleLogout}>
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
