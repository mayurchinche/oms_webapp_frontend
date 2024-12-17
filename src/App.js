
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EmployeeDashboard from './component/EmployeeDashboard';
import '../node_modules/antd/dist/antd.min.js';
import "antd/dist/reset.css"; // Ant Design CSS
import Login from './component/Login';
import ManagerDashboard from './component/ManagerDashboard';
import PODashboard from './component/PODashboard';
import ForgotPassword from './component/ForgotPassword';
import Register from './component/Register';

import ProtectedRoute from './component/ProtectedRoute.js';



function App() {
  return (
  //   <Router>
  //   <Routes>
  //     <Route path="/NewManagerDashboard" element={<NewManagerDashboard />} />
  //     <Route path="/login" element={<Login />} />
  //     <Route path="/Register" element={<Register />} />
  //     <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
  //     <Route path="/manager-dashboard" element={<ManagerDashboard />} />
  //     <Route path="/po-dashboard" element={<PODashboard />} />
  //     <Route path="/dashboard" element={<DashboardPage />} />
  //     <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route for ForgotPassword */}
      
  //   </Routes>
  // </Router>
  <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/po-dashboard"
          element={
            <ProtectedRoute requiredRole="po_team">
              <PODashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
);
}

export default App;
