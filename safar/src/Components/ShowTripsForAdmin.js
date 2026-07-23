import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  DELETE_TRIP: "DELETE_TRIP",
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
    case ACTIONS.DELETE_TRIP:
      return {
        ...state,
        trips: state.trips.filter((trip) => trip.tripId !== action.payload),
      };
    default:
      return state;
  }
};

const Trips = () => {
  const [state, dispatch] = useReducer(tripsReducer, {
    trips: [],
    loading: true,
    error: null,
  });

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const backendUrl = "http://localhost:8200/admin/getActiveTrips";
  const deleteUrl = "http://localhost:8200/admin/deleteTrip";

  useEffect(() => {
    const fetchTrips = async () => {
      dispatch({ type: ACTIONS.SET_LOADING });
      try {
        const response = await fetch(backendUrl);
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
  }, []);

  const deleteTrip = async (tripId) => {
    try {
      const response = await fetch(deleteUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }), // Ensure correct JSON format
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      alert("Trip deleted successfully!!");
      dispatch({ type: ACTIONS.DELETE_TRIP, payload: tripId });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const openModal = (trip) => setSelectedTrip(trip);
  const closeModal = () => setSelectedTrip(null);

  const filteredTrips = state.trips.filter((trip) =>
    trip.tripName.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search for trips by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
        />
      </div>

      <div className="row">
        {filteredTrips.map((trip) => (
          <div className="col-md-4 mb-4" key={trip.tripId}>
            <div className="card h-100">
              <img
                src={trip.imgdesc}
                className="card-img-top"
                alt={trip.tripName}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{trip.tripName}</h5>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteTrip(trip.tripId)}
                >
                  Suspend Trip
                </button>
                <button
                  className="btn btn-info mt-2 ms-2"
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
                <h5 className="modal-title">{selectedTrip.tripName}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Description:</strong> {selectedTrip.description}</p>
                <p><strong>Destination:</strong> {selectedTrip.destination}</p>
                <p><strong>Price per Person:</strong> ₹{selectedTrip.price}</p>
                <p><strong>Start Date:</strong> {`${selectedTrip.startDate.day}-${selectedTrip.startDate.month}-${selectedTrip.startDate.year}`}</p>
                <p><strong>End Date:</strong> {`${selectedTrip.endDate.day}-${selectedTrip.endDate.month}-${selectedTrip.endDate.year}`}</p>
                <img
                  src={selectedTrip.imgdesc}
                  alt={selectedTrip.tripName}
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

export default Trips;
