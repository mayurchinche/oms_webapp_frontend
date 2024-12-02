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
      return {
        order: ['View Orders', 'Add Order'],
        management: ['Manage Materials'], // Manager has actions only in 'MANAGEMENT' group
        reviewAction: ['Pending Reviews','Reversal Pending Reviews'], // No actions for 'manager' in review actions
        deliveryActions: [], // No actions for 'manager' in delivery actions
        analysis: ['Analysis']
      };
    case 'po_team':
      return {
        order: [],
        management: ['Manage Suppliers'],
        reviewAction: [],
        deliveryActions: ['Raise PO', 'Mark Delivery', 'Raise DC', 'Mark Reversal Delivery'],
        analysis: []
      };
    case 'employee':
    default:
      return {
        order: ['View Orders', 'Add Order'],
        management: [], // No management actions for 'employee'
        reviewAction: [], // No review actions for 'employee'
        deliveryActions: [], // No delivery actions for 'employee'
        analysis: []
      };
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
        {/* ORDER Group */}
        {menuItems.order.length > 0 && (
          <div className="sidebar-item-group">
          <p className="sidebar-group-title">ORDER</p>
          {menuItems.order.map((item, index) => (
            <div className="sidebar-item" key={index}>
              {iconMapping[item]} <span>{item}</span>
            </div>
          ))}
        </div>
        )}
        <div className="sidebar-divider" />

        {/* MANAGEMENT Group - Only show for 'manager' and 'po_team' */}
        {menuItems.management.length > 0 && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">MANAGEMENT</p>
            {menuItems.management.map((item, index) => (
              <div className="sidebar-item" key={index}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* REVIEW ACTION Group - Only show for 'manager' */}
        {menuItems.reviewAction.length > 0 && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">REVIEW ACTION</p>
            {menuItems.reviewAction.map((item, index) => (
              <div className="sidebar-item" key={index}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* DELIVERY ACTIONS Group - Only show for 'po_team' */}
        {menuItems.deliveryActions.length > 0 && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">DELIVERY ACTIONS</p>
            {menuItems.deliveryActions.map((item, index) => (
              <div className="sidebar-item" key={index}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="sidebar-divider" />

        {/* ANALYSIS Group */}
        {menuItems.analysis.length > 0 && (
          <div className="sidebar-item-group">
            <p className="sidebar-group-title">ANALYSIS</p>
            {menuItems.analysis.map((item, index) => (
              <div className="sidebar-item" key={index}>
                {iconMapping[item]} <span>{item}</span>
              </div>
            ))}
          </div>
        )}

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
