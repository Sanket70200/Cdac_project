import React, { useReducer, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const initialState = {
  selectedPackage: "",
  company_id: "",
  start_date: "",
  end_date: "",
  tourist_allowed: "",
  packages: [],
  trips: [],
  errors: {},
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_TRIPS":
      return { ...state, trips: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case "RESET_FORM":
      return { ...initialState, packages: state.packages, trips: state.trips };
    default:
      return state;
  }
};

const AddTour = () => {
  const userDetails = useSelector((state) => state.logged.userDetails);
  const userid = userDetails?.user_id;
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userid) {
      fetch("http://localhost:8200/crud/getpackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Packages:", data);
          dispatch({ type: "SET_PACKAGES", payload: data });
        })
        .catch((error) => console.error("Error fetching packages:", error));
    }
  }, [userid]);

  useEffect(() => {
    if (userid) {
      fetch("http://localhost:8200/crud/gettripsforcom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      })
        .then((res) => res.json())
        .then((data) => dispatch({ type: "SET_TRIPS", payload: data }))
        .catch((error) => console.error("Error fetching trips:", error));
    }
  }, [userid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tourData = {
      packageid: state.selectedPackage,
      startDate: state.start_date,
      endDate: state.end_date,
      touristAllowed: parseInt(state.tourist_allowed, 10),
    };

    console.log("Sending tour data:", tourData);

    try {
      const response = await fetch("http://localhost:8200/crud/addtrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) throw new Error("Failed to add tour");

      setSuccessMessage("Trip added successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);

      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.error("Error adding tour:", error);
      alert("Failed to add tour.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Trip</h2>
      {successMessage && (
        <div className="alert alert-success text-center mx-auto" style={{ maxWidth: "400px" }} role="alert">
          {successMessage}
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
            <div className="mb-3">
              <label className="form-label">Select Package</label>
              <select
                className="form-select"
                name="selectedPackage"
                value={state.selectedPackage || ""}
                onChange={handleInputChange}
              >
                <option value="">-- Select Package --</option>
                {state.packages.map((pkg) => (
                  <option key={pkg.packageid} value={pkg.packageid}>
                    {pkg.package_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" name="start_date" value={state.start_date || ""} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={state.end_date || ""}
              min={state.start_date} // Prevents selecting a date before start_date
              onChange={handleInputChange}
            />
          </div>

            <div className="mb-3">
              <label className="form-label">Tourists Allowed</label>
              <input type="number" className="form-control" name="tourist_allowed" value={state.tourist_allowed || ""} onChange={handleInputChange} />
            </div>
            <div className="text-center d-flex justify-content-center gap-3">
              <button type="submit" className="btn btn-warning px-4">Add Tour</button>
              <button type="button" className="btn btn-secondary px-4" onClick={() => dispatch({ type: "RESET_FORM" })}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTour;
