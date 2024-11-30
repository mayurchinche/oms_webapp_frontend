// src/component/Login.js
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
    console.log('Login button clicked');
    console.log('Mobile Number:', mobileNumber);
    console.log('Password:', password);

    try {
      const response = await fetch('https://ordermanagementservice-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ contact_number: mobileNumber, password }),
      });

      console.log('API call made');
      console.log('Response status:', response.status);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      const data = responseData[0]; // Access the first element of the response array
      console.log('Parsed data:', data);

      if (data && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('mobileNumber', mobileNumber);
        sessionStorage.setItem('user_name', data.user_name);
        dispatch(setAuth(data.role, data.token, mobileNumber, data.user_name));
        if (data.role === 'employee') {
          navigate('/employee-dashboard');
        } else if (data.role === 'manager') {
          navigate('/manager-dashboard');
        } else if (data.role === 'po_team') {
          navigate('/po-dashboard');
        }
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
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='btn btn-success'>Login</button>
        </form>
        <a className="forgot-password" style={{color:'green'}} href="/forgot-password">Forgot password?</a>
        <p className="register-link" style={{color:'green'}}>Don't have an account? <a href="/">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;