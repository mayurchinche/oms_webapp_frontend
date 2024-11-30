
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EmployeeDashboard from './component/EmployeeDashboard';
import Login from './component/Login';
import ManagerDashboard from './component/ManagerDashboard';
import PODashboard from './component/PODashboard';
import ForgotPassword from './component/ForgotPassword';
import Register from './component/Register';

function App() {
  return (
    <Router>
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/po-dashboard" element={<PODashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route for ForgotPassword */}
    </Routes>
  </Router>
);
}

export default App;
