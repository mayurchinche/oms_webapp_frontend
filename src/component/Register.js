import React, { useState, useRef } from "react";
import firebase from "../firebase.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const recaptchRef = useRef(null);
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    firebase.auth().signInWithCredential(credentials)
      .then(userCredential => {
        console.log('User logged in', userCredential.user);
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
    console.log("otp will be sent on this " + fullPhoneNumber);

    if (recaptchRef.current) {
      recaptchRef.current.innerHTML = '<div id="recaptcha-container"></div>';
    }

    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });

    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, verifier)
      .then(confirmationResult => {
        setVerificationId(confirmationResult.verificationId);
        console.log('otp sent');
        setOtpSent(true);
        setOtpMessage('OTP sent successfully');
      }).catch(error => {
        console.log('error sending otp', error);
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
    };

    try {
      const response = await axios.post('https://stage-testflask.onrender.com/auth/register', userDetails);
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
    },
    input: {
      margin: '10px 0',
      padding: '12px',
      width: '100%',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      margin: '10px 0',
      padding: '12px',
      width: '100%',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    verifiedText: {
      color: 'green',
      margin: '10px 0',
    },
    heading: {
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    message: {
      margin: '10px 0',
      color: 'red',
    },
    otpSentMessage: {
      color: 'green',
      marginBottom: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Sign Up</h1>
        <div ref={recaptchRef}></div>
        {!isVerified ? (
          <>
            <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={styles.input}>
              <option value="+91">🇮🇳 +91</option>
              {/* Add more country codes if needed */}
            </select>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSendOtp} style={styles.button}>Send OTP</button>
            {otpMessage && <p style={styles.message}>{otpMessage}</p>}
            {otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleVerifyOtp} style={styles.button}>Verify OTP</button>
              </>
            )}
          </>
        ) : (
          <>
            <p style={styles.verifiedText}>OTP Verified</p>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            {!isPasswordMatch && <p style={styles.message}>Passwords do not match!</p>}
            <button onClick={handleSignUp} style={styles.button}>Sign Up</button>
            {registrationMessage && <p style={styles.message}>{registrationMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
