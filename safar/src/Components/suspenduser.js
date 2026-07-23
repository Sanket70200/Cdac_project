import React, { useReducer, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const backendUrl = "http://localhost:8200/admin/allActiveUsers";
const suspendUrl = "http://localhost:8200/admin/deleteUser";

const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SUSPEND_USER: "SUSPEND_USER",
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.SUSPEND_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.userId !== action.payload),
      };

    default:
      return state;
  }
};

const SuspendUsers = () => {
  const [state, dispatch] = useReducer(usersReducer, {
    users: [],
    loading: true,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    dispatch({ type: ACTIONS.SET_LOADING });

    try {
      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log("Fetched Users:", data);

      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  };

  const suspendUser = async (userId) => {
    if (!window.confirm("Are you sure you want to suspend this user?")) return;

    try {
      const response = await fetch(suspendUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to suspend user");

      alert(result.message);
      dispatch({ type: ACTIONS.SUSPEND_USER, payload: userId });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredUsers = state.users.filter((user) =>
    (user.firstname || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Suspend Users</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search for users by first name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Loading Indicator */}
      {state.loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Error Message */}
      {state.error && <div className="alert alert-danger text-center">{state.error}</div>}

      {/* User Table */}
      {!state.loading && !state.error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-center">First Name</th>
                <th className="text-center">Last Name</th>
                <th className="text-center">Email</th>
                <th className="text-center">Phone</th>
                <th className="text-center">Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="align-middle">
                    <td className="text-center">{user.firstname || "Unknown"}</td>
                    <td className="text-center">{user.lastname || "Unknown"}</td>
                    <td className="text-center">{user.email || "Unknown"}</td>
                    <td className="text-center">{user.contactno || "Unknown"}</td>
                    <td className="text-center">{user.roleId === 1 ? "Admin" : "User"}</td>
                    <td className="text-center">
                      <button className="btn btn-danger btn-sm px-3" onClick={() => suspendUser(user.userId)}>
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuspendUsers;
