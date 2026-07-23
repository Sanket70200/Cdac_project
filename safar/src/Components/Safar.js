import React, { useState } from "react";
import "./toggle.css";

const Safar = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = (event) => {
    if (event.target.id === 'modal') {
      setModalVisible(false);
    }
  };

  return (
    <div>
      <h2>Login Form with Role Selection</h2>

      <button onClick={() => setModalVisible(true)} style={{ width: 'auto' }}>
        Login
      </button>

      {modalVisible && (
        <div
          id="modal"
          className="modal"
          onClick={handleModalClose}
          style={{ display: 'block' }}
        >
          <div className="modal-content animate">
            <span
              onClick={() => setModalVisible(false)}
              className="close"
              title="Close Modal"
            >
              &times;
            </span>

            <div className="login-box">
              <h2>Welcome</h2>
              <form action="/action_page.php" method="post">
                <div className="user-box">
                  <input type="text" name="username" required />
                  <label>Username</label>
                </div>
                <div className="user-box">
                  <input type="password" name="password" required />
                  <label>Password</label>
                </div>

                {/* Dropdown for Role Selection */}
                <div className="user-box">
                  <select name="role" required>
                    <option value="" disabled selected></option>
                    <option value="admin">Admin</option>
                    <option value="tourist">Tourist</option>
                    <option value="company">Company</option>
                  </select>
                  <label>Role</label>
                </div>

                <button type="submit">Login</button>

                <div className="links">
                  <a href="/forgotpassword">Forgot Password?</a><br/>
                  <a href="/register">Sign Up</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safar;
