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
  useMediaQuery,
  CircularProgress, // Import CircularProgress
  Alert, // Import Alert for showing error message
} from '@mui/material';
import './Login.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode] = useState('91'); // Set the country code to '91' (India) by default
  const [loading, setLoading] = useState(false); // State to track the loading state
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message
  const [mobileNumberError, setMobileNumberError] = useState(''); // State for mobile validation error
  const [passwordError, setPasswordError] = useState(''); // State for password validation error
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error messages before making the request
    setMobileNumberError('');
    setPasswordError('');
    setErrorMessage('');

    let valid = true;

    // Validate the mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileNumberError('Please enter a valid 10-digit mobile number.');
      valid = false;
    }

    // Validate password (ensure it's not empty)
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) {
      return; // If validation fails, prevent the form submission
    }

    // Combine the country code with the mobile number
    const fullMobileNumber = `+${countryCode}${mobileNumber}`;

    // Set loading to true to show the loader
    setLoading(true);

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

      // Check for error in response
      if (responseData[0] && responseData[0].error) {
        setErrorMessage(responseData[0].error); // Set error message from API response
        setLoading(false); // Set loading to false
        return;
      }

      const data = responseData[0];

      setLoading(false); // Set loading to false after receiving the response

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
      setLoading(false); // Set loading to false in case of error
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={isSmallScreen ? 0 : 3} sx={{ p: 4, mt: 8, borderRadius: 2, position: 'relative' }}>
        <Typography component="h1" variant="h5" align="center">
          Login to your account
        </Typography>

        {/* Show error message if it exists */}
        {errorMessage && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}

        {/* Show validation errors */}
        {mobileNumberError && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{mobileNumberError}</Alert>
          </Box>
        )}
        {passwordError && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{passwordError}</Alert>
          </Box>
        )}

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
            disabled={loading} // Disable the button while loading
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

        {/* Show loader when loading state is true */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <CircularProgress size={50} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
