import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../redux/Actions/authActions';
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import './Login.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode] = useState('91'); // Set the country code to '91' (India) by default
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate the mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Combine the country code with the mobile number
    const fullMobileNumber = `+${countryCode}${mobileNumber}`;

    try {
      const response = await fetch('https://ordermanagementservice-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ contact_number: fullMobileNumber, password }),
      });

      const responseData = await response.json();
      const data = responseData[0];

      if (data && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('mobileNumber', fullMobileNumber);
        sessionStorage.setItem('user_name', data.user_name);
        dispatch(setAuth(data.role, data.token, fullMobileNumber, data.user_name));
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
    <Container component="main" maxWidth="xs">
      <Paper elevation={isSmallScreen ? 0 : 3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" align="center">
          Sign into your account
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mobileNumber"
            label="Mobile Number"
            name="mobileNumber"
            autoComplete="tel"
            autoFocus
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your 10-digit mobile number"
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Box display="flex" justifyContent="space-between">
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Link href="/Register" variant="body2">
              Don't have an account? Register here
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;