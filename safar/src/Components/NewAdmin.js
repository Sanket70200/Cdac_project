import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        fieldErrors[name] = value.length < 8 ? "Password must be at least 8 characters long." : null;
        break;
      case "contactno":
        fieldErrors[name] = !/^\d{10}$/.test(value) ? "Contact number must be 10 digits." : null;
        break;
      case "firstname":
      case "lastname":
      case "address":
        fieldErrors[name] = value.trim() === "" ? "This field is required." : null;
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
      const response = await fetch("http://localhost:8200/auth/newAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Registration failed.");
      }

      alert("Registration successful!");
      setFormData({});
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="text-center mb-3">Add New Admin</h3>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Username", name: "username" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Contact No", name: "contactno", type: "number" },
              { label: "First Name", name: "firstname" },
              { label: "Last Name", name: "lastname" },
              { label: "Address", name: "address" },
            ].map(({ label, name, type = "text" }) => (
              <div className="mb-2" key={name}>
                <label htmlFor={name} className="form-label">{label}</label>
                <input
                  type={type}
                  className="form-control"
                  id={name}
                  name={name}
                  onChange={handleChange}
                  value={formData[name] || ""}
                  required
                />
                {errors[name] && <small className="text-danger">{errors[name]}</small>}
              </div>
            ))}
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="d-flex justify-content-center mt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-warning text-white px-4"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
