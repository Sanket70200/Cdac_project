import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SET_LOADING: "SET_LOADING",
};

const tripsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, trips: action.payload, error: null };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CompanyViewTrips = () => {
  const [state, dispatch] = useReducer(tripsReducer, {
    trips: [],
    loading: true,
    error: null,
  });

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userDetails = useSelector((state) => state.logged.userDetails);
  const userid=userDetails.user_id;

  const backendUrl = "http://localhost:8200/crud/gettripsforcom";

  
  useEffect(() => {
    console.log(userDetails.user_id);
    if (!userid) return; // Prevent API call if userId is not available

    const fetchTrips = async () => {
      dispatch({ type: ACTIONS.SET_LOADING });
      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid }), // Passing userId as companyId
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await response.json();
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      }
    };

    fetchTrips();
  }, [userid]); // Fetch only when userId is available

  const openModal = (trip) => setSelectedTrip(trip);
  const closeModal = () => setSelectedTrip(null);

  const filteredTrips = state.trips.filter((trip) =>
    trip.packageid.package_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (state.loading) return <div className="text-center mt-5">Loading...</div>;
  if (state.error) return <div className="text-center text-danger mt-5">Error: {state.error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Trips</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for trips by package name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
        />
      </div>

      <div className="row">
        {filteredTrips.map((trip) => (
          <div className="col-md-4 mb-4" key={trip.trip_id}>
            <div className="card h-100">
              <img
                src={trip.packageid.image_desc.replace(/'/g, "")}
                className="card-img-top"
                alt={trip.packageid.package_name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{trip.packageid.package_name}</h5>
                <button
                  className="btn btn-info mt-2"
                  onClick={() => openModal(trip)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTrip && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTrip.packageid.package_name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Description:</strong> {selectedTrip.packageid.description}</p>
                <p><strong>Source:</strong> {selectedTrip.packageid.source}</p>
                <p><strong>Destination:</strong> {selectedTrip.packageid.destination}</p>
                <p><strong>Price per Person:</strong> ₹{selectedTrip.packageid.person_per_package}</p>
                <p><strong>Start Date:</strong> {selectedTrip.start_date}</p>
                <p><strong>End Date:</strong> {selectedTrip.end_date}</p>
                <img
                  src={selectedTrip.packageid.image_desc.replace(/'/g, "")}
                  alt={selectedTrip.packageid.package_name}
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyViewTrips;
