import {React,useState} from 'react';

import './NewManagerDahsboard.css'; // Ensure the correct spelling of the file name
import Sidebar from './Sidebar'; // Adjust the path as per your project structure

const NewManagerDashboard = () => {
  const role = 'employee'; // or 'employee' based on the logged-in user's role

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Callback to update sidebar toggle state
  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar role={role} onCollapseToggle={handleSidebarToggle} />

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'main-content-collapsed' : ''}`}>
        <h1>Welcome to the New Manager Dashboard</h1>
        <p>
          This is the main content area. It dynamically adjusts when the sidebar is toggled.
        </p>
      </div>
    </div>
  );
};

export default NewManagerDashboard;
