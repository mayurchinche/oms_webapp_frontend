
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EmployeeDashboard from './component/EmployeeDashboard';
import Login from './component/Login';
import ManagerDashboard from './component/ManagerDashboard';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
     <Route path="/manager-dashboard" element={<ManagerDashboard />} />
    </Routes>
  </Router>
  );
}

export default App;
