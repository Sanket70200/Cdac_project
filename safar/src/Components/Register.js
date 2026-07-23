import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({});
    setErrors({});
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    const fieldErrors = { ...errors };
    switch (name) {
      case "username":
        fieldErrors[name] = value.length < 3 ? "Username must be at least 3 characters long." : null;
        break;
      case "email":
        fieldErrors[name] = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email address." : null;
        break;
      case "password":
        fieldErrors[name] =
          value.length < 8
            ? "Password must be at least 8 characters long."
            : !/[A-Z]/.test(value)
            ? "Password must contain at least one uppercase letter."
            : !/[a-z]/.test(value)
            ? "Password must contain at least one lowercase letter."
            : !/[0-9]/.test(value)
            ? "Password must contain at least one number."
            : null;
        break;
      case "contactno":
        fieldErrors[name] = !/^\d{10}$/.test(value) ? "Contact number must be 10 digits." : null;
        break;
      case "firstname":
      case "lastname":
      case "company_name":
        fieldErrors[name] = value.trim() === "" ? "This field is required." : null;
        break;
      case "companyreg_no":
        fieldErrors[name] = value.trim() === "" ? "Registration number is required." : null;
        break;
      case "address":
        fieldErrors[name] = value.trim() === "" ? "Address is required." : null;
        break;
      default:
        break;
    }
    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.values(errors).every((error) => error === null) &&
                    Object.values(formData).every((field) => field);

    if (!isValid) {
      setError("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url =
        userType === "tourist"
          ? "http://localhost:8200/auth/newUser"
          : "http://localhost:8200/auth/newCompany";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Registration failed.");
      }

      alert("Registration successful!");
      setFormData({});
      setUserType(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!userType) return null;

    const commonFields = (
      <>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={handleChange}
              value={formData.username || ""}
              required
            />
            {errors.username && <small className="text-danger">{errors.username}</small>}
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email || ""}
              required
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password || ""}
              required
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <div className="col-md-6">
            <label htmlFor="contactno" className="form-label">
              Contact No
            </label>
            <input
              type="number"
              className="form-control"
              id="contactno"
              name="contactno"
              onChange={handleChange}
              value={formData.contactno || ""}
              required
            />
            {errors.contactno && <small className="text-danger">{errors.contactno}</small>}
          </div>
        </div>
      </>
    );

    return (
      <div>
        {userType === "tourist" && (
          <>
            {commonFields}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  name="firstname"
                  onChange={handleChange}
                  value={formData.firstname || ""}
                  required
                />
                {errors.firstname && <small className="text-danger">{errors.firstname}</small>}
              </div>
              <div className="col-md-6">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  name="lastname"
                  onChange={handleChange}
                  value={formData.lastname || ""}
                  required
                />
                {errors.lastname && <small className="text-danger">{errors.lastname}</small>}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  onChange={handleChange}
                  value={formData.address || ""}
                  required
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>
            </div>
          </>
        )}
        {userType === "company" && (
          <>
            {commonFields}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="company_name" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="company_name"
                  name="company_name"
                  onChange={handleChange}
                  value={formData.company_name || ""}
                  required
                />
                {errors.company_name && <small className="text-danger">{errors.company_name}</small>}
              </div>
              <div className="col-md-6">
                <label htmlFor="companyreg_no" className="form-label">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="companyreg_no"
                  name="companyreg_no"
                  onChange={handleChange}
                  value={formData.companyreg_no || ""}
                  required
                />
                {errors.companyreg_no && <small className="text-danger">{errors.companyreg_no}</small>}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="address" className="form-label">
                  Company Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  onChange={handleChange}
                  value={formData.address || ""}
                  required
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg w-100" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Sign up</h2>
          <div className="d-flex justify-content-center mb-3">
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                margin: "0 10px",
              }}
              onClick={() => handleUserTypeSelect("tourist")}
            >
              Register as Tourist
            </button>
            <button
              style={{
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                margin: "0 10px",
              }}
              onClick={() => handleUserTypeSelect("company")}
            >
              Register as Company
            </button>
          </div>
          {userType && (
            <form onSubmit={handleSubmit}>
              {renderForm()}
              {error && <p className="text-danger">{error}</p>}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    margin: "0 10px",
                  }}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect(null)}
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    margin: "0 10px",
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <center>
                  <Link to="/login" className="text-decoration-none" style={{ color: "green" }}>
                    Back to Login
                  </Link>
                </center>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
