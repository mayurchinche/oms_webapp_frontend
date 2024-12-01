import { setAuth } from '../redux/Actions/authActions';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://ordermanagementservice-backend.onrender.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ contact_number: mobileNumber, password }),
        }
      );

      const responseData = await response.json();
      const data = responseData[0];

      if (data && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('mobileNumber', mobileNumber);
        sessionStorage.setItem('user_name', data.user_name);
        dispatch(setAuth(data.role, data.token, mobileNumber, data.user_name));
        navigate(
          data.role === 'employee'
            ? '/employee-dashboard'
            : data.role === 'manager'
            ? '/manager-dashboard'
            : '/po-dashboard'
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign into your account</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="log-in-btn-primary">
            Login
          </button>
        </form>
        <a className="link-green" href="/forgot-password">
          Forgot password?
        </a>
        <p className="link-green">
          Don't have an account? <a href="/Register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
