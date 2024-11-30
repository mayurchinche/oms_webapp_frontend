// src/component/ForgotPassword.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    console.log('Sending OTP to:', `${countryCode}${mobileNumber}`);
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved:', response);
        }
      }, auth);
    }
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
        setOtpVerified(true);
        setStep(3);
        console.log('OTP verified successfully');
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

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const user = auth.currentUser;
    user.updatePassword(newPassword)
      .then(() => {
        console.log('Password reset successful');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
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
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </label>
          {newPassword && confirmPassword && (
            <p>{newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</p>
          )}
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;