import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBookingsHistory = () => {
    const [bookedTrips, setBookedTrips] = useState([]);
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

    // Generate and Download PDF
    const handleDownload = (trip) => {
        const { days, nights } = calculateDaysNights(trip.start_date, trip.end_date);
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("Trip Booking Receipt", 65, 20);
        pdf.setLineWidth(0.5);
        pdf.line(20, 25, 190, 25);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Package Name: ${trip.package_name}`, 20, 40);
        pdf.text(`Source: ${trip.source}`, 20, 50);
        pdf.text(`Destination: ${trip.destination}`, 20, 60);
        pdf.text(`Start Date: ${trip.start_date}`, 20, 70);
        pdf.text(`End Date: ${trip.end_date}`, 20, 80);
        pdf.text(`Duration: ${days} Days / ${nights} Nights`, 20, 90);
        pdf.text(`Booked By: ${userDetails.firstname || "Guest"}`, 20, 100);
        pdf.text(`Number of Bookings: ${trip.noOfBookings}`, 20, 120);
        pdf.text(`Total Price: ₹ ${trip.amount}`, 20, 140);
        pdf.line(20, 125, 190, 125);

        // pdf.setFont("helvetica", "bold");
        // pdf.text("Travelers:", 20, 135);
        // pdf.setFont("helvetica", "normal");
        // let y = 145;
        // trip.travelers?.forEach((traveler, index) => {
        //     pdf.text(`${index + 1}. ${traveler.name} (Age: ${traveler.age}, Gender: ${traveler.gender})`, 25, y);
        //     y += 10;
        // });

        pdf.save(`Trip_Receipt_${trip.package_name}.pdf`);
    };

    if (bookedTrips.length === 0) {
        return <p className="text-center mt-4">No bookings found.</p>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">My Bookings History</h2>
            <div className="row">
                {bookedTrips.map((trip) => {
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
                                    <div className="d-flex justify-content-center mt-3">
                                        <button 
                                            className="btn btn-success px-3 fw-bold"
                                            onClick={() => handleDownload(trip)}
                                        >
                                            Download Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyBookingsHistory;