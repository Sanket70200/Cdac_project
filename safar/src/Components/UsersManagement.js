import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SET_LOADING: "SET_LOADING",
  UPDATE_USER_STATUS: "UPDATE_USER_STATUS",
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.UPDATE_USER_STATUS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload.userId
            ? { ...user, status: action.payload.status }
            : user
        ),
      };

    default:
      return state;
  }
};

const UsersManagement = () => {
  const [state, dispatch] = useReducer(usersReducer, {
    users: [],
    loading: true,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const backendUrl = "http://localhost:8203/alluser";
  const updateStatusUrl = "http://localhost:8203/deleteuser";

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: ACTIONS.SET_LOADING });

      try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      }
    };

    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await fetch(`${updateStatusUrl}?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userId), // Send raw integer
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      alert(`User status updated to ${status === 1 ? "Active" : "Inactive"}!`);
      dispatch({ type: ACTIONS.UPDATE_USER_STATUS, payload: { userId, status } });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredUsers = state.users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (state.loading) return <div className="text-center mt-5">Loading...</div>;
  if (state.error) return <div className="text-center text-danger mt-5">Error: {state.error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
        />
      </div>

      {/* Users Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${user.accountstatus === 1 ? "bg-success" : "bg-danger"}`}>
                  {user.status === 1 ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => updateUserStatus(user.user_id, 1)}
                  disabled={user.accountstatus === 1} // Disable if already active
                >
                  Activate
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => updateUserStatus(user.user_id, 0)}
                  disabled={user.accountstatus === 0} // Disable if already inactive
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
