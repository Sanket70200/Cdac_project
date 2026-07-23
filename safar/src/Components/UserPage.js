import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation to booking/login page

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

function UserPage() {
  const userDetails = useSelector((state) => state.logged.userDetails); // Get user details from Redux
  const navigate = useNavigate(); // Hook to navigate between pages

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State to control the popup visibility

  const backendUrl = "http://localhost:8200/crud/gettripsforuser";
  const addToCartUrl = "http://localhost:8200/crud/addtocart"; // The POST endpoint for adding to the cart
  const addToWishlistUrl = "http://localhost:8200/crud/addtowishlist"; // The POST endpoint for adding to the wishlist

  // UseReducer for managing trips and loading state
  const [state, dispatch] = useReducer(tripsReducer, {
    trips: [],
    loading: true,
    error: null,
  });

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

  const filteredTrips = state.trips.filter((trip) =>
    trip.packageid.package_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the "Add to Cart" button click
  const handleAddToCart = async (trip) => {
    if (!userDetails) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
      return;
    }
  
    const cartCheckData = {
      userId: userDetails.user_id,
      tripId: trip.trip_id,
    };
  
    try {
      console.log("Checking if trip exists in cart...", cartCheckData);
  
      // Step 1: Check if trip is already in cart
      const checkResponse = await fetch("http://localhost:8200/crud/existsincart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartCheckData),
      });
  
      if (!checkResponse.ok) {
        throw new Error(`Failed to check cart status: ${checkResponse.status}`);
      }
  
      const checkData = await checkResponse.json();
      console.log("Cart Check Response:", checkData);
  
      // ✅ Fix: Check if the trip is already in the cart
      if (checkData === true) {
        alert("This trip is already in your cart!");
        return;
      }
  
      console.log("Adding trip to cart...");
  
      // Step 2: Add trip to cart if not already present
      const response = await fetch(addToCartUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartCheckData),
      });
  
      console.log("Cart Response Status:", response.status);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to add to cart. Response:", errorMessage);
        throw new Error(`Failed to add to cart: ${errorMessage}`);
      }
  
      const responseData = await response.json();
      console.log("Cart Response Data:", responseData);
  
      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  

  // Handle the "Add to Wishlist" button click
  const handleAddToWishlist = async (trip) => {
    if (!userDetails) {
      setShowLoginPopup(true);
      return;
    }
  
    const wishlistCheckData = {
      userId: userDetails.user_id,
      tripId: trip.trip_id,
    };
  
    try {
      console.log("Checking if trip exists in wishlist...", wishlistCheckData);
  
      const checkResponse = await fetch("http://localhost:8200/crud/existsinwishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishlistCheckData),
      });
  
      if (!checkResponse.ok) {
        throw new Error(`Failed to check wishlist status: ${checkResponse.status}`);
      }
  
      const checkData = await checkResponse.json();
      console.log("Wishlist Check Response:", checkData); // Debugging
  
      // ✅ Fix: Directly check if checkData is true
      if (checkData === true) {
        alert("This trip is already in your wishlist!");
        return;
      }
  
      console.log("Adding trip to wishlist...");
  
      const response = await fetch("http://localhost:8200/crud/addtowishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishlistCheckData),
      });
  
      console.log("Wishlist Response Status:", response.status);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to add to wishlist. Response:", errorMessage);
        throw new Error(`Failed to add to wishlist: ${errorMessage}`);
      }
  
      const responseData = await response.json();
      console.log("Wishlist Response Data:", responseData);
  
      alert("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  
  
  
  
  
  
  // Handle the "Login" button click in the popup
  const handleLoginClick = () => {
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <main>
      {/* Hero Section */}
      <div
        className="hero-section text-center text-white"
        style={{
          background: "linear-gradient(45deg, #ff7e5f, #feb47b)",
          padding: "4rem 2rem",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          Discover Your Next Adventure
        </h1>
        <h3
          style={{
            fontSize: "1.25rem",
            marginTop: "1rem",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Find the best trips and travel deals just for you!
        </h3>
      </div>

      {/* Search Bar */}
      <div className="container my-4">
        <form className="d-flex align-items-center mx-auto" style={{ maxWidth: "600px" }}>
          <input
            className="form-control rounded-pill px-4 py-2"
            type="search"
            placeholder="Search trips"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
          />
        </form>
      </div>

      {/* Trips Section */}
      <div className="container mt-5">
        <div className="row">
          {filteredTrips.map((trip) => (
            <div className="col-md-4 mb-4" key={trip.trip_id}>
              <div className="card h-100 shadow-lg rounded-3">
                <img
                  src={trip.packageid.image_desc.replace(/'/g, "")}
                  className="card-img-top"
                  alt={trip.packageid.package_name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-between align-items-center">
                    {trip.packageid.package_name}
                    <button
                      className="btn btn-info mt-2 w-20"
                      onClick={() => setSelectedTrip(trip)} // Open details in modal (if required)
                    >
                      View Details
                    </button>
                  </h5>

                  <div className="d-flex justify-content-start gap-2 mt-3">
                    <button
                      className="btn btn-success mt-2 w-100"
                      onClick={() => handleAddToWishlist(trip)} // Add trip to wishlist
                    >
                      Add to Wishlist
                    </button>
                    <button
                      className="btn btn-success mt-2 w-100"
                      onClick={() => handleAddToCart(trip)} // Add trip to cart
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            zIndex: "1050",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLoginPopup(false)} // Close the modal
                ></button>
              </div>
              <div className="modal-body">
                <p>You need to log in to book this trip. Do you want to log in?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLoginClick} // Redirect to login page
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLoginPopup(false)} // Close the modal
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Trip Details */}
      {selectedTrip && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block", // Display modal
            zIndex: "1050", // Ensure it overlays other content
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTrip.packageid.package_name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTrip(null)} // Close the modal
                ></button>
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
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedTrip(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default UserPage;
