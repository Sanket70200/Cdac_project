import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:8200/crud";

const UserFeedback = () => {
  const userDetails = useSelector((state) => state.logged?.userDetails);
  const userId = userDetails?.user_id;
  const [trips, setTrips] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.packageId === Number(selectedPackageId)),
    [trips, selectedPackageId]
  );

  const loadTrips = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/feedback/eligible-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Unable to load completed trips.");
      const data = await response.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [userId]);

  useEffect(() => {
    setRating(selectedTrip?.rating || 0);
    setFeedbackDesc(selectedTrip?.feedbackDesc || "");
    setMessage(null);
  }, [selectedTrip]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTrip || rating === 0) {
      setMessage({ type: "danger", text: "Please select a trip and a rating." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          packageId: selectedTrip.packageId,
          rating,
          feedbackDesc,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save feedback.");

      setMessage({ type: "success", text: "Thank you. Your feedback has been saved." });
      await loadTrips();
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (value) => value
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`))
    : "Completed trip";

  if (!userId) {
    return <div className="alert alert-warning m-4">Please log in to share feedback about your completed trips.</div>;
  }

  return (
    <main className="container py-4" style={{ maxWidth: "850px" }}>
      <div className="mb-4">
        <p className="text-uppercase text-primary fw-bold small mb-1">Traveller feedback</p>
        <h1 className="h2 mb-2">Share your experience</h1>
        <p className="text-muted mb-0">Your review helps other travellers choose with confidence and helps companies improve their service.</p>
      </div>

      {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

      {loading ? (
        <p className="text-center text-muted py-5">Loading completed trips…</p>
      ) : trips.length === 0 ? (
        <section className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <div className="fs-1 mb-2">✦</div>
            <h2 className="h5">No completed trips to review</h2>
            <p className="text-muted mb-0">Feedback opens after a booked trip has ended.</p>
          </div>
        </section>
      ) : (
        <form className="card border-0 shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body p-4 p-md-5">
            <div className="mb-4">
              <label htmlFor="feedback-trip" className="form-label fw-semibold">Completed trip</label>
              <select
                id="feedback-trip"
                className="form-select"
                value={selectedPackageId}
                onChange={(event) => setSelectedPackageId(event.target.value)}
              >
                <option value="">Choose a trip</option>
                {trips.map((trip) => (
                  <option key={trip.packageId} value={trip.packageId}>
                    {trip.packageName} — {trip.source} to {trip.destination} (ended {formatDate(trip.endDate)})
                  </option>
                ))}
              </select>
            </div>

            {selectedTrip && (
              <>
                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="fw-semibold">{selectedTrip.packageName}</div>
                  <small className="text-muted">{selectedTrip.source} → {selectedTrip.destination} · ended {formatDate(selectedTrip.endDate)}</small>
                </div>

                <fieldset className="mb-4">
                  <legend className="fs-6 fw-semibold mb-2">Your rating</legend>
                  <div className="d-flex gap-2" aria-label="Select rating from 1 to 5 stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        className={`btn ${star <= rating ? "btn-warning" : "btn-outline-secondary"}`}
                        type="button"
                        key={star}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mb-4">
                  <label htmlFor="feedback-description" className="form-label fw-semibold">Tell us about your trip</label>
                  <textarea
                    id="feedback-description"
                    className="form-control"
                    rows="5"
                    maxLength="255"
                    placeholder="What did you enjoy? What can be improved?"
                    value={feedbackDesc}
                    onChange={(event) => setFeedbackDesc(event.target.value)}
                    required
                  />
                  <div className="form-text text-end">{feedbackDesc.length}/255</div>
                </div>

                <button className="btn btn-primary px-4" type="submit" disabled={submitting}>
                  {submitting ? "Saving feedback…" : selectedTrip.rating ? "Update feedback" : "Submit feedback"}
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </main>
  );
};

export default UserFeedback;
