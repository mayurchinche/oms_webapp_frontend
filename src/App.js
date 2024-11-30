import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes,Switch } from 'react-router-dom';
import Register from './component/Register';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Register />} />
    </Routes>
  </Router>
  );
}

export default App;
