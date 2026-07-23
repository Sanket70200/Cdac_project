import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const ViewTripFeedback = () => {
  const userDetails = useSelector((state) => state.logged.userDetails);
  const userid = userDetails?.user_id;
  
  const [packages, setPackages] = useState([]);
  const [trips, setTrips] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");
  
  // Fetch Packages from the backend
  useEffect(() => {
    if (userid) {
      fetch("http://localhost:8080/getpackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      })
        .then((res) => res.json())
        .then((data) => setPackages(data))
        .catch((error) => console.error("Error fetching packages:", error));
    }
  }, [userid]);

  // Fetch Trips based on the selected package
  useEffect(() => {
    if (selectedPackage) {
      fetch("http://localhost:8080/gettripbypack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageid: selectedPackage }),
      })
        .then((res) => res.json())
        .then((data) => setTrips(data))
        .catch((error) => console.error("Error fetching trips:", error));
    }
  }, [selectedPackage]);

  // Fetch Feedback based on selected trip
  useEffect(() => {
    if (selectedTrip) {
      fetch("http://localhost:8203/getfeedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripid: selectedTrip }),
      })
        .then((res) => res.json())
        .then((data) => setFeedbacks(data))
        .catch((error) => console.error("Error fetching feedbacks:", error));
    }
  }, [selectedTrip]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Trip Feedback</h2>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 shadow-lg rounded bg-light">
            {/* Package Selection */}
            <div className="mb-3">
              <label className="form-label">Select Package</label>
              <select
                className="form-select"
                value={selectedPackage}
                onChange={(e) => {
                  setSelectedPackage(e.target.value);
                  setSelectedTrip(""); // Reset trip selection
                  setFeedbacks([]); // Clear feedbacks
                }}
              >
                <option value="">-- Select Package --</option>
                {packages.map((pkg) => (
                  <option key={pkg.packageid} value={pkg.packageid}>
                    {pkg.package_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trip Selection */}
            <div className="mb-3">
              <label className="form-label">Select Trip (Start Date - End Date)</label>
              <select
                className="form-select"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              >
                <option value="">-- Select Trip --</option>
                {trips.map((trip) => (
                  <option key={trip.tripid} value={trip.tripid}>
                    {trip.startDate} - {trip.endDate}
                  </option>
                ))}
              </select>
            </div>

            {/* Feedback List */}
            {feedbacks.length > 0 ? (
              <div className="mt-4">
                <h5 className="text-center">Feedbacks</h5>
                <ul className="list-group">
                  {feedbacks.map((feedback) => (
                    <li key={feedback.feedbackid} className="list-group-item">
                      <strong>{feedback.username}:</strong> {feedback.comment}
                    </li>
                  ))}
                </ul>
              </div>
            ) : selectedTrip ? (
              <p className="text-center text-muted">No feedback available for this trip.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTripFeedback;
