
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './component/Login';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      
    </Routes>
  </Router>
  );
}

export default App;