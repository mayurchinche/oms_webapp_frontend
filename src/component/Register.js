import React, { useState, useRef } from 'react';
import firebase from '../firebase.config';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Backdrop,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LinkMUI from '@mui/material/Link'; // Alias import to avoid conflicts with React Router's Link
import './Register.css';

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [selectedRole, setSelectedRole] = useState('employee'); // Default role is 'employee'
  const [loading, setLoading] = useState(false); // Loader state
  const recaptchRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleVerifyOtp = () => {
    setLoading(true); // Show loader while verifying OTP
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    firebase.auth().signInWithCredential(credentials)
      .then(() => {
        setIsVerified(true);
        setLoading(false); // Hide loader after verification
      }).catch(error => {
        console.error('Error in verifying OTP', error);
        setLoading(false); // Hide loader if there's an error
      });
  };

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      setOtpMessage('Enter a valid 10-digit number');
      return;
    }
    setOtpMessage('');
    setLoading(true); // Show loader while sending OTP
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    if (recaptchRef.current) {
      recaptchRef.current.innerHTML = '<div id="recaptcha-container"></div>';
    }

    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA verified
      },
      'expired-callback': () => {
        // reCAPTCHA expired
      }
    });
    document.getElementById('recaptcha-container').style.display = 'none';

    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, verifier)
      .then(confirmationResult => {
        setVerificationId(confirmationResult.verificationId);
        setOtpSent(true);
        setOtpMessage('OTP sent successfully');
        setLoading(false); // Hide loader after OTP sent
      }).catch(error => {
        console.log('Error sending OTP', error);
        setOtpMessage('Error sending OTP. Please try again.');
        setLoading(false); // Hide loader if there's an error
      });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setIsPasswordMatch(false);
      return;
    }
    setIsPasswordMatch(true);
    setLoading(true); // Show loader while signing up

    const idToken = await firebase.auth().currentUser.getIdToken();
    const userDetails = {
      contact_number: `+91${phoneNumber}`,
      id_token: idToken,
      user_name: `${name} ${lastName}`,
      password,
      role: selectedRole, // Send the selected role here
    };

    try {
      const response = await axios.post('https://ordermanagementservice-backend.onrender/auth/register', userDetails);
      if (response.status === 200) {
        setRegistrationMessage(response.data.message);
        setLoading(false); // Hide loader after successful registration
        navigate('/');
      } else {
        setRegistrationMessage(response.data.message || 'Registration failed.');
        setLoading(false); // Hide loader if there's an issue
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationMessage('Failed to register, please try again.');
      setLoading(false); // Hide loader if there's an error
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={isSmallScreen ? 0 : 3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" align="center">
          Sign Up
        </Typography>
        <div ref={recaptchRef}></div>

        {!isVerified ? (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="country-code-label">Country Code</InputLabel>
              <Select
                labelId="country-code-label"
                id="country-code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                label="Country Code"
              >
                <MenuItem value="+91">�������� +91</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Mobile Number"
              name="phoneNumber"
              autoComplete="tel"
              autoFocus
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your 10-digit mobile number"
              inputProps={{ maxLength: 10 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
            
            {otpMessage && <Alert severity="info">{otpMessage}</Alert>}
            
            {otpSent && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="verificationCode"
                  label="Enter OTP"
                  name="verificationCode"
                  autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </Button>
              </>
            )}

            <Box display="flex" justifyContent="center">
              <LinkMUI component={Link} to="/login">
                Already registered? Click here to login
              </LinkMUI>
            </Box>
          </>
        ) : (
          <>
            <Alert severity="success">OTP Verified</Alert>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="First Name"
              name="name"
              autoComplete="given-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="po_team">PO Team</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            {!isPasswordMatch && <Alert severity="error">Passwords do not match!</Alert>}
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            
            {registrationMessage && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {registrationMessage}
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Register;