import React, { useState, useRef } from "react";
import firebase from "../firebase.config";
import axios from "axios";
import { Box, Button, TextField, Typography, Card, CardContent, MenuItem, FormControl, InputLabel, Select, Alert } from "@mui/material";
import { useNavigate ,Link} from "react-router-dom";
import { getAuth } from 'firebase/auth';
import BackgroundImage from '../BackgroundImage';
const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [resetMessage, setResetMessage] = useState('');
  const recaptchRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth(); // Ensure this matches your Firebase initialization
  

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

  const handleVerifyOtp = () => {
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    firebase.auth().signInWithCredential(credentials)
      .then(userCredential => {
        setIsVerified(true);
      }).catch(error => {
        console.error('Error in verifying OTP', error);
        setOtpMessage('Invalid OTP, please try again.');
      });
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setIsPasswordMatch(false);
      return;
    }
    setIsPasswordMatch(true);

    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const userDetails = {
        contact_number: `${countryCode}${phoneNumber}`,
        new_password: newPassword
      };

      const response = await axios.put('https://ordermanagementservice-backend.onrender.com/auth/set_new_password', userDetails);
      if (response.status === 200) {
        setResetMessage('Password reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setResetMessage('Failed to reset password, please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetMessage('Failed to reset password, please try again.');
    }
  };

  return (
    
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative' }}>
      {/* BackgroundImage component is used here */}
      <BackgroundImage />
      
      {/* Content Box with the form */}
      <Card sx={{ width: 400, padding: 3, position: 'absolute', zIndex: 1 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
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
                  <MenuItem value="+91">+91</MenuItem>
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
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSendOtp}
                sx={{ mt: 2 }}
              >
                Send OTP
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already registered?{' '}
                <Link to="/login" underline="hover">
                  Click here to login
                </Link>
              </Typography>
              {otpMessage && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {otpMessage}
                </Alert>
              )}
              {otpSent && (
                <>
                  <TextField
                    fullWidth
                    type="text"
                    margin="normal"
                    label="Enter OTP"
                    variant="outlined"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleVerifyOtp}
                    sx={{ mt: 2 }}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
                OTP Verified
              </Typography>
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="New Password"
                variant="outlined"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Confirm New Password"
                variant="outlined"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                error={!isPasswordMatch}
                helperText={!isPasswordMatch ? "Passwords do not match!" : ""}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                sx={{ mt: 2 }}
              >
                Reset Password
              </Button>
              {resetMessage && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {resetMessage}
                </Alert>
              )}
            </>
            
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;