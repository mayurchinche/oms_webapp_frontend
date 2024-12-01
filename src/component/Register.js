import React, { useState, useRef } from "react";
import firebase from "../firebase.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [selectedRole, setSelectedRole] = useState('employee');  // Default role is 'employee'
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
      size: 'invisible',  // Invisible reCAPTCHA
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
      role: selectedRole,  // Send the selected role here
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

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Sign Up</h1>
        <div ref={recaptchRef}></div>
        {!isVerified ? (
          <>
            <select value={countryCode} onChange={e => setCountryCode(e.target.value)}>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
            {otpMessage && <p className="message">{otpMessage}</p>}
            {otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
              </>
            )}
          </>
        ) : (
          <>
            <p className="verified-text">OTP Verified</p>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            {/* Role Dropdown */}
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="po_team">PO Team</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {!isPasswordMatch && <p className="message">Passwords do not match!</p>}
            <button onClick={handleSignUp}>Sign Up</button>
            {registrationMessage && <p className="message">{registrationMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
