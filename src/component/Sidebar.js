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
  FaUserCircle, // Icon for user symbol
} from 'react-icons/fa';

// Define a mapping for button names to their corresponding icons
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

// Menu items based on the role
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

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    const newCollapseState = !isCollapsed;
    setIsCollapsed(newCollapseState);
    onCollapseToggle(newCollapseState);
  };

  // Get menu items for the current role
  const menuItems = getMenuItems(role);

  return (
    <div className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* User Info Section */}
      <div className="sidebar-user-info">
        <FaUserCircle className="sidebar-user-icon" />
        <p className="sidebar-username">Username</p>
        <p className="sidebar-contact-number">+1 (123) 456-7890</p>
      </div>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Sidebar menu items */}
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div className="sidebar-item" key={index}>
            {iconMapping[item]} <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Arrow button to toggle sidebar */}
      <div className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </div>
    </div>
  );
};

export default Sidebar;
