import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBookings = () => {
    const [bookedTrips, setBookedTrips] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    
    // Get user details from Redux store
    const userDetails = useSelector((state) => state.logged?.userDetails);
    const userId = userDetails?.user_id;

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userId) return;

            try {
                const response = await fetch("http://localhost:8200/crud/getbooking", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userid: userId }),
                });

                if (!response.ok) throw new Error("Failed to fetch bookings");

                const data = await response.json();
                setBookedTrips(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [userId]);

    // Function to calculate trip duration
    const calculateDaysNights = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return { days, nights: days - 1 };
    };

    // Function to preview the receipt
    const handlePreview = async (trip) => {
        try {
            const response = await fetch("http://localhost:8200/api/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: userId }),
            });

            if (!response.ok) throw new Error("Failed to fetch trip details");

            const tripDetails = await response.json();
            setPreviewData(tripDetails);
        } catch (error) {
            console.error("Error fetching trip details:", error);
        }
    };

    // Function to download the receipt as a PDF
    const handleDownload = () => {
        if (!previewData) {
            console.warn("No preview data available!");
            return;
        }

        const { days, nights } = calculateDaysNights(previewData.startDate, previewData.endDate);

        const pdf = new jsPDF("p", "mm", "a4");
        pdf.setFontSize(16);
        pdf.text("Booked Package Receipt", 70, 20);
        
        pdf.setFontSize(12);
        pdf.text(`Package Name: ${previewData.packageName}`, 20, 40);
        pdf.text(`Source: ${previewData.source}`, 20, 50);
        pdf.text(`Destination: ${previewData.destination}`, 20, 60);
        pdf.text(`Start Date: ${previewData.startDate}`, 20, 70);
        pdf.text(`End Date: ${previewData.endDate}`, 20, 80);
        pdf.text(`Duration: ${days} Days / ${nights} Nights`, 20, 90);
        pdf.text(`Booked By: ${userDetails?.name || "Guest"}`, 20, 100);
        pdf.text(`Payment Type: ${previewData.paymentType}`, 20, 110);
        pdf.text(`Total Price: ₹ ${previewData.totalPrice}`, 20, 120);
        
        pdf.text("Travelers:", 20, 130);
        let y = 140;
        previewData.travelers.forEach((traveler, index) => {
            pdf.text(`${index + 1}. ${traveler.name} (Age: ${traveler.age}, Gender: ${traveler.gender})`, 25, y);
            y += 10;
        });

        pdf.save(`Trip_Receipt_${previewData.packageName}.pdf`);
    };

    if (bookedTrips.length === 0) {
        return <p className="text-center mt-4">No bookings found.</p>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">My Bookings</h2>
            <div className="row">
                {bookedTrips.map((trip, index) => {
                    const { days, nights } = calculateDaysNights(trip.start_date, trip.end_date);
                    return (
                        <div key={trip.tripId} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-lg border-0 rounded-3 p-3" style={{ backgroundColor: "#f8f9fa" }}>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{trip.package_name}</h5>
                                    <hr />
                                    <p className="card-text">
                                        <strong>From:</strong> {trip.source} <br />
                                        <strong>To:</strong> {trip.destination} <br />
                                        <strong>Start Date:</strong> {trip.start_date} <br />
                                        <strong>End Date:</strong> {trip.end_date} <br />
                                        <strong>Duration:</strong> {days} Days / {nights} Nights <br />
                                        <strong>Price:</strong> <span className="fw-bold text-success">₹ {trip.amount}</span>
                                    </p>
                                    <div className="d-flex justify-content-between mt-3">
                                        <button 
                                            className="btn btn-outline-dark px-3 fw-bold"
                                            
                                        >
                                            Cancel Trip
                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preview Modal */}
            {previewData && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Receipt Preview</h5>
                                <button type="button" className="btn-close" onClick={() => setPreviewData(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Package Name:</strong> {previewData.packageName}</p>
                                <p><strong>From:</strong> {previewData.source}</p>
                                <p><strong>To:</strong> {previewData.destination}</p>
                                <p><strong>Start Date:</strong> {previewData.startDate}</p>
                                <p><strong>End Date:</strong> {previewData.endDate}</p>
                                <p><strong>Duration:</strong> {calculateDaysNights(previewData.startDate, previewData.endDate).days} Days</p>
                                <p><strong>Total Price:</strong> ₹ {previewData.totalPrice}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setPreviewData(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
