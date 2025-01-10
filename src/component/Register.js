import React, { useState, useRef } from "react";
import firebase from "../firebase.config";
import axios from "axios";
import { Box, Container, Typography, TextField, Button, CircularProgress, Alert, Paper, Link } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [step, setStep] = useState(1); // 1: Phone Number, 2: OTP, 3: Registration Details
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    
    const fullPhoneNumber = `+91${phoneNumber}`;
    
    // Reset reCAPTCHA container and initialize reCAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'; // Reset container
    }

    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible", // Invisible reCAPTCHA
      callback: () => console.log("reCAPTCHA verified"),
    });

    // Render the reCAPTCHA before sending OTP
    recaptchaVerifier.render().then(() => {
      firebase
        .auth()
        .signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          setVerificationId(confirmationResult.verificationId);
          setLoading(false);
          setStep(2);
        })
        .catch((error) => {
          console.error("Error sending OTP", error);
          setLoading(false);
          setErrorMessage(error.message || "Failed to send OTP. Please try again.");
        });
    }).catch((error) => {
      console.error("Error initializing reCAPTCHA", error);
      setLoading(false);
      setErrorMessage("Failed to initialize reCAPTCHA. Please try again.");
    });
  };

  const handleVerifyOtp = () => {
    const credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    firebase
      .auth()
      .signInWithCredential(credentials)
      .then(() => {
        setIsVerified(true);
        setStep(3);
      })
      .catch((error) => {
        console.error("Error verifying OTP", error);
        setErrorMessage("Invalid OTP. Please try again.");
      });
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const userDetails = {
        contact_number: `+91${phoneNumber}`,
        id_token: idToken,
        user_name: `${name} ${lastName}`,
        password,
        role: selectedRole,
      };
      const response = await axios.post(
        "https://ordermanagementservice-backend.onrender.com/auth/register",
        userDetails
      );
      setLoading(false);
      if (response.status === 200) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          height: "100%",
        }}
      >
        {/* Left Side: Carousel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
         <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img
        src="https://via.placeholder.com/500x300/0000FF/FFFFFF?text=Image+1"
        className="d-block w-100"
        alt="Image 1"
        style={{ objectFit: "cover", height: "300px" }}
      />
    </div>
    <div className="carousel-item">
      <img
        src="https://via.placeholder.com/500x300/33FF57/FFFFFF?text=Image+2"
        className="d-block w-100"
        alt="Image 2"
        style={{ objectFit: "cover", height: "300px" }}
      />
    </div>
    <div className="carousel-item">
      <img
        src="https://via.placeholder.com/500x300/33FF57/FFFFFF?text=Image+3"
        className="d-block w-100"
        alt="Image 3"
        style={{ objectFit: "cover", height: "300px" }}
      />
    </div>
  </div>
  {/* Add controls for sliding manually */}
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>

        </Box>

        {/* Right Side: Registration Form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: isSmallScreen ? 3 : 0,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              padding: 4,
              textAlign: "center",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Register
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {step === 1 && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  inputProps={{ maxLength: 10 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send OTP"}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Enter OTP"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyOtp}
                  sx={{ mt: 2 }}
                >
                  Verify OTP
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleRegister}
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
                </Button>
              </>
            )}

            {/* Go to Login Link */}
            <Box sx={{ mt: 2 }}>
              <Link
                href="/login"
                variant="body2"
                sx={{ color: "primary.main", textDecoration: "none" }}
              >
                Already have an account? Log in
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Registration;
