import React, { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./slice";

var localhost = "http://localhost:8200/auth";

export default function Safar_login() {
  const [msg, setMsg] = useState(""); // General error message
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // For loading state

  const init = {
    username: "",
    password: "",
  };

  const navigate = useNavigate();
  const reduxAction = useDispatch();

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        return state;
    }
  };

  const [info, dispatch] = useReducer(reducer, init);

  const inUsername = (e) => {
    dispatch({ type: "update", field: "username", value: e.target.value });
    setErrors((prev) => ({ ...prev, username: "" }));
  };

  const inPassword = (e) => {
    dispatch({ type: "update", field: "password", value: e.target.value });
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!info.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (info.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      valid = false;
    }

    if (!info.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (info.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Set loading state
    const getData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: info.username,
        password: info.password,
      }),
    };

    fetch(localhost + "/login", getData)
      .then((resp) => {
        if (!resp.ok) {
          return resp.text().then((errorMsg) => {
            throw new Error(errorMsg); // Handle error from backend
          });
        }
        return resp.json();
      })
      .then((obj) => {
        reduxAction(login(obj)); // Dispatch user details to Redux
        if (obj.role_id.role_id === 3) {
          navigate("/company");
        } else if (obj.role_id.role_id === 1) {
          navigate("/admin");
        } else if (obj.role_id.role_id === 2) {
          navigate("/user");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setMsg(error.message || "An unexpected error occurred");
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        className="login-container p-5 rounded shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <center>
          <h2 className="mb-4" style={{ color: "orange" }}>
            Welcome
          </h2>
        </center>
        <form onSubmit={onLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              value={info.username}
              onChange={inUsername}
              placeholder="Enter your username"
              required
              className="form-control"
            />
            {errors.username && (
              <small style={{ color: "red" }}>{errors.username}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              value={info.password}
              onChange={inPassword}
              placeholder="Enter your password"
              required
              className="form-control"
            />
            {errors.password && (
              <small style={{ color: "red" }}>{errors.password}</small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "orange", color: "white" }}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-3 text-center">
           <Link
                  to="/forgetpassword"
              className="text-decoration-none"
              style={{ color: "green" }}
            >
              Forgot Password
            </Link>
            <br />
            <br />
            Don't have an account?{" "}
            <div>
              <center>
                <Link
                  to="/signup"
                  className="text-decoration-none"
                  style={{ color: "green" }}
                >
                  Sign up
                </Link>
              </center>
            </div>
          </div>

          <div className="mt-3">
            <center>
              <p className="message" style={{ color: "red" }}>
                {msg}
              </p>
            </center>
          </div>
        </form>
      </div>
    </div>
  );
}
