// src/component/Register.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('employee');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [idToken, setIdToken] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    console.log('Sending OTP to:', `${countryCode}${mobileNumber}`);
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `${countryCode}${mobileNumber}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        setStep(2);
        startOtpTimer();
        console.log('OTP sent successfully');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
      });
  };

  const handleVerifyOtp = () => {
    console.log('Verifying OTP:', otp);
    window.confirmationResult.confirm(otp)
      .then((result) => {
        result.user.getIdToken().then((token) => {
          setIdToken(token);
          setOtpVerified(true);
          setStep(3);
          console.log('OTP verified successfully, ID token:', token);
        });
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
      });
  };

  const startOtpTimer = () => {
    let timer = 60;
    setOtpTimer(timer);
    const interval = setInterval(() => {
      timer -= 1;
      setOtpTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleRegister = () => {
    const userData = {
      contact_number: `${countryCode}${mobileNumber}`,
      id_token: idToken,
      password: password,
      role: role,
      user_name: `${firstName} ${lastName}`
    };

    console.log('Registering user with data:', userData);

    axios.post('/auth/register', userData)
      .then((response) => {
        console.log('Registration successful:', response.data);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {step === 1 && (
        <div>
          <label>
            Country Code:
            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
              <option value="+91">India (+91)</option>
              {/* Add more country codes as needed */}
            </select>
          </label>
          <label>
            Mobile Number:
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </label>
          <button onClick={handleSendOtp}>Send OTP</button>
          <div id="recaptcha-container"></div>
        </div>
      )}
      {step === 2 && (
        <div>
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </label>
          <p>OTP expires in {otpTimer} seconds</p>
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          <button onClick={handleSendOtp}>Send Again</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </label>
          <label>
            Re-enter Password:
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </label>
          {password && rePassword && (
            <p>{password === rePassword ? 'Passwords match' : 'Passwords do not match'}</p>
          )}
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="po_team">PO Team</option>
            </select>
          </label>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
      <p>
        Already registered? <a href="/login">Go to Login</a>
      </p>
    </div>
  );
};

export default Register;