import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../redux/Actions/authActions';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import './Login.css'; // Include custom CSS for background and styles

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e) => {
    e.preventDefault();

    setMobileNumberError('');
    setPasswordError('');
    setErrorMessage('');

    let isValid = true;

    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileNumberError('Enter a valid 10-digit mobile number.');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }
    if (!isValid) return;

    setLoading(true);
    try {
      const response = await fetch('https://ordermanagementservice-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ contact_number: `+91${mobileNumber}`, password }),
      });

      const data = await response.json();

      if (data[0]?.error) {
        setErrorMessage(data[0].error);
        setLoading(false);
        return;
      }

      if (data[0]?.token) {
        const userData = data[0];
        sessionStorage.setItem('token', userData.token);
        sessionStorage.setItem('role', userData.role);
        sessionStorage.setItem('mobileNumber', `+91${mobileNumber}`);
        sessionStorage.setItem('user_name', userData.user_name);
        dispatch(setAuth(userData.role, userData.token, `+91${mobileNumber}`, userData.user_name));

        navigate(
          userData.role === 'employee'
            ? '/employee-dashboard'
            : userData.role === 'manager'
            ? '/manager-dashboard'
            : '/po-dashboard'
        );
      } else {
        setErrorMessage(data[0]?.message || 'Unexpected error occurred.');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          height: '100%',
        }}
      >
        {/* Left Side: Carousel */}
       
<Box
  sx={{
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }}
>
  <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
    <div className="carousel-inner">
    <div className="carousel-item active">
  <img
    src="./images/losma.jpg"
    className="d-block w-100"
    alt="Image 1"
    style={{ objectFit: 'contain', height: '300px' }}
  />
</div>

      <div className="carousel-item active">
      <img
    src="./images/losma_portfolio.jpg"
    className="d-block w-100"
    alt="Image 1"
    style={{ objectFit: 'contain', height: '300px' }}
  />
      </div>
      <div className="carousel-item">
      <img
    src="./images/losma.jpg"
    className="d-block w-100"
    alt="Image 1"
    style={{ objectFit: 'contain', height: '300px' }}
  />
      </div>
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</Box>

        {/* Right Side: Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: isSmallScreen ? 3 : 0,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              padding: 4,
              textAlign: 'center',
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Log in to continue
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                error={Boolean(mobileNumberError)}
                helperText={mobileNumberError}
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(passwordError)}
                helperText={passwordError}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 1,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                  fontSize: '14px',
                }}
              >
                <Link
                  href="/forgot-password"
                  underline="hover"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Forgot Password?
                </Link>
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Register Here
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
