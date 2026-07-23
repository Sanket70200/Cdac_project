import React, { useReducer, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const backendUrl = "http://localhost:8200/admin/allInactiveUsers";
const approveUrl = "http://localhost:8200/admin/activateUser";

const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  APPROVE_USER: "APPROVE_USER",
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.APPROVE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.userId !== action.payload),
      };
    default:
      return state;
  }
};

const ApprovedUsers = () => {
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
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  };

  const approveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this user?")) return;
    try {
      const response = await fetch(approveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to approve user");
      alert(result.message);
      dispatch({ type: ACTIONS.APPROVE_USER, payload: userId });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredUsers = state.users.filter((user) =>
    (user?.firstname?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Manage User Approvals</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users by first name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {state.loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary"></div>
          <p>Loading...</p>
        </div>
      )}
      {state.error && <div className="alert alert-danger">{state.error}</div>}
      {!state.loading && !state.error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.firstname || "Unknown"}</td>
                    <td>{user.lastname || "Unknown"}</td>
                    <td>{user.email || "Unknown"}</td>
                    <td>{user.contactno || "Unknown"}</td>
                    <td>{user.roleId === 1 ? "Admin" : "User"}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => approveUser(user.userId)}>
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedUsers;
