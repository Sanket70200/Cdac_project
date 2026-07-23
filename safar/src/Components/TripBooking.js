import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPage = () => {
    const userDetails = useSelector((state) => state.logged.userDetails);
    const [tripData, setTripData] = useState(null);
    const [travelers, setTravelers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userDetails) return;
        fetch(`http://localhost:8203/api/trips/${userDetails.tripId}`)
            .then((response) => response.json())
            .then((data) => {
                setTripData(data);
                setTravelers(Array.from({ length: userDetails.quantity }, () => ({
                    user_id: userDetails.userId,
                    age: "",
                    gender: "",
                    adhar_no: "",
                    trip_id: userDetails.tripId,
                    firstname: "",
                    lastname: "",
                    tcontactno: "",
                })));
            })
            .catch((error) => console.error("Error fetching trip data:", error));
    }, [userDetails]);

    const calculateNightsAndDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        return { nights, days: nights + 1 };
    };

    const handleTravelerChange = (index, field, value) => {
        const updatedTravelers = [...travelers];
        updatedTravelers[index][field] = value;
        setTravelers(updatedTravelers);
    };

    const handleSubmit = () => {
        fetch("http://localhost:8203/api/travelers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(travelers),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Booking confirmed!");
                navigate("/bookingtrip");
            })
            .catch((error) => console.error("Error submitting travelers:", error));
    };

    if (!tripData) return <p>Loading...</p>;

    const { nights, days } = calculateNightsAndDays(tripData.startDate, tripData.endDate);

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <img src={tripData.image_desc} className="card-img-top" alt={tripData.package_name} />
                <div className="card-body">
                    <h3 className="text-center">{tripData.package_name}</h3>
                    <p className="text-muted text-center">{tripData.description}</p>
                </div>
            </div>

            <div className="mt-4 p-4 border rounded bg-light">
                <h4>Trip Details</h4>
                <p><strong>Start Date:</strong> {tripData.startDate}</p>
                <p><strong>End Date:</strong> {tripData.endDate}</p>
                <p><strong>Duration:</strong> {nights} Nights / {days} Days</p>
            </div>

            <div className="mt-4 p-4 border rounded bg-light">
                <h4>Add Travelers</h4>
                {travelers.map((traveler, index) => (
                    <div key={index} className="p-3 mb-3 border rounded bg-white">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={traveler.firstname} onChange={(e) => handleTravelerChange(index, "firstname", e.target.value)} />

                        <label>Last Name</label>
                        <input type="text" className="form-control" value={traveler.lastname} onChange={(e) => handleTravelerChange(index, "lastname", e.target.value)} />

                        <label>Age</label>
                        <input type="number" className="form-control" value={traveler.age} onChange={(e) => handleTravelerChange(index, "age", e.target.value)} />

                        <label>Gender</label>
                        <select className="form-control" value={traveler.gender} onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <label>Aadhar No</label>
                        <input type="text" className="form-control" value={traveler.adhar_no} onChange={(e) => handleTravelerChange(index, "adhar_no", e.target.value)} />

                        <label>Contact No</label>
                        <input type="text" className="form-control" value={traveler.tcontactno} onChange={(e) => handleTravelerChange(index, "tcontactno", e.target.value)} />
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <button className="btn btn-success btn-lg" onClick={handleSubmit}>Confirm Booking</button>
            </div>
        </div>
    );
};

export default BookingPage;
