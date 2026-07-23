import React, { useReducer, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const backendUrl = "http://localhost:8200/admin/getForApproveCompanies";
const approveUrl = "http://localhost:8200/admin/approveCompany";

const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  APPROVE_COMPANY: "APPROVE_COMPANY",
};

const companiesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, companies: action.payload, error: null };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.APPROVE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(company => company.companyId !== action.payload),
      };

    default:
      return state;
  }
};

const ApprovedCompanies = () => {
  const [state, dispatch] = useReducer(companiesReducer, {
    companies: [],
    loading: true,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    dispatch({ type: ACTIONS.SET_LOADING });

    try {
      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  };

  const approveCompany = async (userId, companyId) => {
    if (!window.confirm("Are you sure you want to approve this company?")) return;

    try {
      const response = await fetch(approveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // Corrected JSON format
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to approve company");

      alert(result.message);
      dispatch({ type: ACTIONS.APPROVE_COMPANY, payload: companyId });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredCompanies = state.companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Companies</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for companies by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
        />
      </div>

      {state.loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading...</p>
        </div>
      )}

      {state.error && <div className="alert alert-danger text-center">{state.error}</div>}

      {!state.loading && !state.error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Registration No</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <tr key={company.companyId}>
                  <td>{company.name}</td>
                  <td>{company.companyId}</td>
                  <td>{company.email}</td>
                  <td>{company.phoneNumber}</td>
                  <td>{company.address}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => approveCompany(company.userId)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovedCompanies;
