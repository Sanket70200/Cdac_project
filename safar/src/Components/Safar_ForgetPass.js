import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8200/auth"; // Replace with the correct backend URL

export default function ForgotPassword() {
  const [msg, setMsg] = useState(""); // General messages
  const [error, setError] = useState(""); // Error message
  const [email, setEmail] = useState(""); // Email state
  const [loading, setLoading] = useState(false); // Loading state
  const [otpSent, setOtpSent] = useState(false); // Flag to show OTP input
  const [otp, setOtp] = useState(""); // State for OTP input
  const [newPassword, setNewPassword] = useState(""); // New password field
  const [isOtpValid, setIsOtpValid] = useState(false); // Track OTP validation
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Reset error when user starts typing
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const checkEmailAndSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/checkemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.status === "exists") {
        await fetch(`${API_URL}/sendotp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        setOtpSent(true);
        setMsg("OTP sent to your email.");
      } else {
        setError("Email address not found.");
      }
    } catch (error) {
      setMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/validateotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setIsOtpValid(true);
        setMsg("OTP is valid. You can now reset your password.");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMsg("An error occurred while validating OTP.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/updatepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setMsg("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Error updating password.");
      }
    } catch (error) {
      setMsg("An error occurred while resetting password.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="login-container p-5 rounded shadow-lg bg-white" style={{ maxWidth: "400px", width: "100%" }}>
        <center>
          <div className="mt-3 text-center">
            <Link to="/login" className="text-decoration-none text-success">
              Back to Login
            </Link>
          </div>
          <h2 className="mb-4 text-warning">Forgot Password</h2>
        </center>

        {!otpSent && !isOtpValid && (
          <form onSubmit={checkEmailAndSendOtp}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email Address:</label>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required className="form-control" />
              {error && <small className="text-danger">{error}</small>}
            </div>
            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
              {loading ? "Checking..." : "Check Email & Send OTP"}
            </button>
          </form>
        )}

        {otpSent && !isOtpValid && (
          <form onSubmit={validateOtp}>
            <div className="form-group mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP:</label>
              <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter OTP" required className="form-control" />
            </div>
            <button type="submit" className="btn btn-warning w-100">Validate OTP</button>
          </form>
        )}

        {isOtpValid && (
          <form onSubmit={resetPassword}>
            <div className="form-group mb-3">
              <label htmlFor="newPassword" className="form-label">New Password:</label>
              <input type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder="Enter new password" required className="form-control" />
            </div>
            <button type="submit" className="btn btn-warning w-100">Reset Password</button>
          </form>
        )}

        <div className="mt-3 text-center">
          <p className={msg.includes("successful") || msg.includes("OTP sent") || msg.includes("OTP is valid") ? "text-success" : "text-danger"}>{msg}</p>
        </div>
      </div>
    </div>
  );
}
