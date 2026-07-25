import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:8200/crud";

const ViewTripFeedback = () => {
  const userDetails = useSelector((state) => state.logged.userDetails);
  const userId = userDetails?.user_id;
  const [packages, setPackages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      if (!userId) {
        setLoadingPackages(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/getpackages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: userId }),
        });

        if (!response.ok) throw new Error("Unable to load packages.");
        setPackages(await response.json());
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoadingPackages(false);
      }
    };

    loadPackages();
  }, [userId]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      if (!selectedPackageId) {
        setFeedbacks([]);
        return;
      }

      setLoadingFeedbacks(true);
      setMessage("");
      try {
        const response = await fetch(`${API_BASE}/getfeedbacks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageid: Number(selectedPackageId) }),
        });

        if (!response.ok) throw new Error("Unable to load feedback for this package.");
        const data = await response.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (error) {
        setFeedbacks([]);
        setMessage(error.message);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    loadFeedbacks();
  }, [selectedPackageId]);

  const averageRating = useMemo(() => {
    if (!feedbacks.length) return null;
    return (feedbacks.reduce((total, item) => total + (item.rating || 0), 0) / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const formatDate = (value) => value
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
    : "Recently";

  if (!userId) {
    return <div className="alert alert-warning m-4">Please log in as a company to view package feedback.</div>;
  }

  return (
    <main className="container py-4" style={{ maxWidth: "980px" }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <p className="text-uppercase text-primary fw-bold small mb-1">Customer insights</p>
          <h1 className="h2 mb-2">Package feedback</h1>
          <p className="text-muted mb-0">Choose a package to read verified reviews from completed trips.</p>
        </div>
        {averageRating && (
          <div className="bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 text-center">
            <div className="fw-bold fs-5">★ {averageRating}/5</div>
            <small className="text-muted">from {feedbacks.length} review{feedbacks.length === 1 ? "" : "s"}</small>
          </div>
        )}
      </div>

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <label htmlFor="feedback-package" className="form-label fw-semibold">Select package</label>
          <select
            id="feedback-package"
            className="form-select"
            value={selectedPackageId}
            disabled={loadingPackages}
            onChange={(event) => setSelectedPackageId(event.target.value)}
          >
            <option value="">{loadingPackages ? "Loading packages…" : "Choose a package"}</option>
            {packages.map((item) => (
              <option key={item.packageid} value={item.packageid}>
                {item.package_name} — {item.source} to {item.destination}
              </option>
            ))}
          </select>
        </div>
      </section>

      {message && <div className="alert alert-danger">{message}</div>}

      {selectedPackageId && loadingFeedbacks && <p className="text-center text-muted py-4">Loading feedback…</p>}

      {selectedPackageId && !loadingFeedbacks && feedbacks.length === 0 && (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <div className="fs-1 mb-2">☆</div>
            <h2 className="h5">No feedback yet</h2>
            <p className="text-muted mb-0">Reviews will appear here after travellers complete this package.</p>
          </div>
        </div>
      )}

      {!loadingFeedbacks && feedbacks.length > 0 && (
        <section className="d-grid gap-3" aria-label="Customer feedback">
          {feedbacks.map((feedback) => (
            <article className="card border-0 shadow-sm" key={feedback.feedbackId}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between gap-3 mb-3">
                  <div>
                    <h2 className="h6 mb-1">{feedback.reviewerName}</h2>
                    <small className="text-muted">{formatDate(feedback.createdAt)}</small>
                  </div>
                  <div className="text-warning fw-bold" aria-label={`${feedback.rating} out of 5 stars`}>
                    {"★".repeat(feedback.rating || 0)}<span className="text-secondary">{"★".repeat(5 - (feedback.rating || 0))}</span>
                  </div>
                </div>
                <p className="mb-0 text-secondary">{feedback.feedbackDesc}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default ViewTripFeedback;
