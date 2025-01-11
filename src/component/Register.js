import React, { useState, useRef } from "react";
import firebase from "../firebase.config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import './Register.css';
import {
  TextField, Button, Card, CardContent, Typography, MenuItem, Select, InputLabel, FormControl, Grid, Box
} from '@mui/material';

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
  const recaptchRef = useRef(null);
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    firebase.auth().signInWithCredential(credentials)
      .then(userCredential => {
        setIsVerified(true);
      }).catch(error => {
        console.error('Error in verifying OTP', error);
      });
  };

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      setOtpMessage('Enter a valid 10-digit number');
      return;
    }
    setOtpMessage('');
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    if (recaptchRef.current) {
      recaptchRef.current.innerHTML = '<div id="recaptcha-container"></div>';
    }

    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("reCAPTCHA verified:", response);
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired.");
      }
    });
    document.getElementById('recaptcha-container').style.display = 'none';

    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, verifier)
      .then(confirmationResult => {
        setVerificationId(confirmationResult.verificationId);
        setOtpSent(true);
        setOtpMessage('OTP sent successfully');
      }).catch(error => {
        console.log('Error sending OTP', error);
      });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setIsPasswordMatch(false);
      return;
    }
    setIsPasswordMatch(true);

    const idToken = await firebase.auth().currentUser.getIdToken();
    const userDetails = {
      contact_number: `+91${phoneNumber}`,
      id_token: idToken,
      user_name: `${name} ${lastName}`,
      password: password,
      role: selectedRole, // Send the selected role here
    };

    try {
      const response = await axios.post('https://ordermanagementservice-backend.onrender.com/auth/register', userDetails);
      if (response.status === 200) {
        setRegistrationMessage(response.data.message);
        navigate('/');
      } else {
        setRegistrationMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationMessage('Failed to register, please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Card sx={{ width: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <div ref={recaptchRef}></div>
          {!isVerified ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Country Code</InputLabel>
                <Select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                >
                  <MenuItem value="+91">🇮🇳 +91</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="tel"
                margin="normal"
                label="Mobile Number"
                variant="outlined"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
              <Button fullWidth variant="contained" color="primary" onClick={handleSendOtp}>
                Send OTP
              </Button>
              {otpSent && (
                <TextField
                  fullWidth
                  type="text"
                  margin="normal"
                  label="Enter OTP"
                  variant="outlined"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
              )}
              {otpSent && (
                <Button fullWidth variant="contained" color="secondary" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              )}
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already registered?{' '}
                <Link to="/login" underline="hover">
                  Click here to login
                </Link>
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
                OTP Verified
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="po_team">PO Team</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Password"
                variant="outlined"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Confirm Password"
                variant="outlined"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={!isPasswordMatch}
                helperText={!isPasswordMatch ? 'Passwords do not match!' : ''}
              />
              <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSignUp}>
                Sign Up
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;