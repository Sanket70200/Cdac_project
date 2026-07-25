import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import PaymentForm from './PaymentForm';


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

function Card() {
  const userDetails = useSelector((state) => state.logged.userDetails);
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookingCount, setBookingCount] = useState(1);
  const [state, dispatch] = useReducer(tripsReducer, {
    trips: [],
    loading: true,
    error: null,
  });
  const [travelerDetails, setTravelerDetails] = useState([]);
  const [showTravelerModal, setShowTravelerModal] = useState(false);

  const [showBookingModal, setShowBookingModal] = useState(false);
  //const [selectedTrip, setSelectedTrip] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showPaymentModal, setShowPaymentModal] = useState(false);



  const backendUrl = "http://localhost:8200/crud/getcart";
  const removeFromCardUrl = "http://localhost:8200/crud/removecart";
  const addToCartUrl = "http://localhost:8200/crud/addtocart";
  const checkAvailabilityUrl = "http://localhost:8200/crud/checkAvailability";
  //const submitTravelerDataUrl = "http://localhost:8203/savetorist"; 

  // const handleAddToCart = async (trip) => {
  //   if (!userDetails) {
  //     setShowLoginPopup(true);
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(addToCartUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: userDetails.user_id,
  //         tripId: trip.trip_id,
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to add to cart");
  //     }
  
  //     alert("Trip added to cart successfully!");
  //     // Refresh cart after adding (optional)
  //   } catch (error) {
  //     console.error("Error adding to cart:", error.message);
  //   }
  // };
  

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userDetails) {
        setShowLoginPopup(true);
        return;
      }

      dispatch({ type: ACTIONS.SET_LOADING });

      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userDetails.user_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      }
    };

    fetchTrips();
  }, [userDetails]);

  const removeFromCard = async (tripId) => {
    if (!userDetails) {
      setShowLoginPopup(true);
      return;
    }
  
    try {
      const response = await fetch(removeFromCardUrl, {
        method: "POST",  // Change method from DELETE to POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: tripId,  // Backend expects JSON body
          userId: userDetails.user_id,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to remove from cart");
  
      alert("Trip removed from cart successfully!");
      
      // Update state to reflect the change in the UI
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: state.trips.filter(trip => trip.trip_id !== tripId) });
  
    } catch (error) {
      console.error("Error removing from cart:", error.message);
    }
  };
  

  useEffect(() => {
    if (selectedTrip && showBookingModal) {
      setShowBookingModal(true);
    }
  }, [selectedTrip, showBookingModal]);

  const handleBookingSubmit = async () => {
    if (!userDetails || !selectedTrip) return;

    try {
      // Check seat availability
      const response = await fetch(checkAvailabilityUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: selectedTrip.trip_id,
          quantity: bookingCount,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        alert(error);  // Show error message if seats are not available
        return;
      }

      // Open the modal to collect traveler details
      setShowTravelerModal(true);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };




          const handleTravelerFormSubmit = () => {
            setShowTravelerModal(false); // Close the modal

            if (selectedTrip) {
              const pricePerPerson = selectedTrip.packageid?.person_per_package || 0;
              const totalCost = pricePerPerson * bookingCount;
              setTotalPrice(totalCost);
              setShowBookingModal(true);
            }
          };





  const handleTravelerChange = (index, field, value) => {
    const newDetails = [...travelerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setTravelerDetails(newDetails);
  };

  const handleBooking = (trip) => {
    if (!userDetails) {
      setShowLoginPopup(true);
      return;
    }
    

    setSelectedTrip(trip); // Set the selected trip for booking

    
  };

  const handleProceedToPayment = () => {
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };
  

        const handleCloseModal = () => {
            setShowPaymentModal(false);
        };

        const isTravelerFormValid = () => {
          return travelerDetails.every(traveler =>
            traveler.firstName &&
            traveler.lastName &&
            traveler.age >= 1 &&
            traveler.age <= 100 &&
            traveler.gender &&
            /^\d{12}$/.test(traveler.adharNo)
          );
        };
        

  return (
    <main>
      {/* Hero Section */}
      <div className="hero-section text-center text-white" style={{ background: "linear-gradient(45deg, #ff7e5f, #feb47b)", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Discover Your Next Adventure</h1>
        <h3 style={{ fontSize: "1.25rem", marginTop: "1rem" }}>Find the best trips and travel deals just for you!</h3>
      </div>

      {/* Trips Section */}
      <div className="container mt-5">
        <div className="row">
          {state.loading ? (
            <div>Loading...</div>
          ) : state.error ? (
            <div>Error: {state.error}</div>
          ) : state.trips.length === 0 ? (
            <div className="text-center" style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px" }}>
              Cart is empty
            </div>
          ) : (
            state.trips.map((trip) => (
              <div className="col-md-4 mb-4" key={trip.trip_id}>
                <div className="card h-100 shadow-lg rounded-3">
                  <img src={trip.packageid.image_desc.replace(/'/g, "")} className="card-img-top" alt={trip.packageid.package_name} style={{ height: "200px", objectFit: "cover" }} />
                  <div className="card-body">
                    <h5 className="card-title">{trip.packageid.package_name}</h5>

                    <div className="d-flex justify-content-start gap-2 mt-3">
                      <button className="btn btn-danger w-100" onClick={() => removeFromCard(trip.trip_id)}>
                        Remove from Card
                      </button>
                      <button className="btn btn-success w-100" onClick={() => handleBooking(trip)}>
                        Book Now
                      </button>
                    </div>

                    {/* Show input field for number of bookings if this trip is selected */}
                    {selectedTrip && selectedTrip.trip_id === trip.trip_id && (
                      <div className="mt-3">
                        <label htmlFor="bookingCount" className="form-label">Enter Number of Bookings</label>
                        <input
                          type="number"
                          id="bookingCount"
                          value={bookingCount}
                          onChange={(e) => setBookingCount(Number(e.target.value))}
                          className="form-control"
                          min="1"
                        />
                        <button className="btn btn-primary mt-2 w-100" onClick={handleBookingSubmit}>
                          Confirm Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginPopup(false)}></button>
              </div>
              <div className="modal-body">
                <p>You need to log in to modify your cart. Do you want to log in?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginPopup(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Traveler Details Modal */}
{showTravelerModal && (
  <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Enter Traveler Details</h5>
          <button type="button" className="btn-close" onClick={() => setShowTravelerModal(false)}></button>
        </div>
        <div className="modal-body">
          {Array.from({ length: bookingCount }).map((_, index) => (
            <div key={index} className="mb-3">
              <h6>Traveler {index + 1}</h6>
              <input
                type="text"
                placeholder="First Name"
                className="form-control mb-2"
                onChange={(e) => handleTravelerChange(index, "firstName", e.target.value)}
                value={travelerDetails[index]?.firstName || ""}
                required
              />
              {!travelerDetails[index]?.firstName && <p className="text-danger">First name is required.</p>}

              <input
                type="text"
                placeholder="Last Name"
                className="form-control mb-2"
                onChange={(e) => handleTravelerChange(index, "lastName", e.target.value)}
                value={travelerDetails[index]?.lastName || ""}
                required
              />
              {!travelerDetails[index]?.lastName && <p className="text-danger">Last name is required.</p>}

              <input
                type="number"
                placeholder="Age"
                className="form-control mb-2"
                onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                value={travelerDetails[index]?.age || ""}
                min="1"
                max="100"
                required
              />
              {(travelerDetails[index]?.age <= 0 || travelerDetails[index]?.age > 100) && (
                <p className="text-danger">Age must be between 1 and 100.</p>
              )}

              <select
                className="form-control mb-2"
                onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                value={travelerDetails[index]?.gender || ""}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {!travelerDetails[index]?.gender && <p className="text-danger">Gender is required.</p>}

              <input
                type="text"
                placeholder="Aadhar No"
                className="form-control mb-2"
                onChange={(e) => handleTravelerChange(index, "adharNo", e.target.value)}
                value={travelerDetails[index]?.adharNo || ""}
                required
                maxLength="12"
                minLength="12"
              />
              {travelerDetails[index]?.adharNo && !/^\d{12}$/.test(travelerDetails[index]?.adharNo) && (
                <p className="text-danger">Aadhar number must be exactly 12 digits.</p>
              )}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowTravelerModal(false)}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleTravelerFormSubmit} disabled={!isTravelerFormValid()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* preview modal */}
      {showBookingModal && selectedTrip && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Package Name:</strong> {selectedTrip.packageid.package_name}</p>
                <p><strong>Start Date:</strong> {selectedTrip.start_date}</p>
                <p><strong>End Date:</strong> {selectedTrip.end_date}</p>
                <p><strong>Number of Days & Nights:</strong> {(new Date(selectedTrip.end_date) - new Date(selectedTrip.start_date)) / (1000 * 60 * 60 * 24)} days</p>
                <p><strong>Price Per Person:</strong> {selectedTrip.packageid.person_per_package}</p>
               
                <p><strong>Total Travelers:</strong> {bookingCount}</p>

                <p><strong>Total Price:</strong> {totalPrice}</p>
                
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Back</button>
                <button className="btn btn-primary" onClick={handleProceedToPayment}>
                    Proceed to Payment
                    </button>


              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
              <Modal show={showPaymentModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PaymentForm 
              userId={userDetails?.user_id} 
              tripId={selectedTrip?.trip_id} 
              totalPrice={totalPrice}
              bookingCount={bookingCount}
              email={userDetails?.email}
              userName={userDetails?.name}
              tripDetails={`Trip to ${selectedTrip?.packageid?.package_name} on ${selectedTrip?.start_date}`}
              travelerDetails={travelerDetails}  // Pass traveler details
              onClose={handleCloseModal} 
            />
          </Modal.Body>
        </Modal>



    </main>
  );
}

export default Card;