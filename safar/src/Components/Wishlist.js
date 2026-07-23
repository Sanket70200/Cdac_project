import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SET_LOADING: "SET_LOADING",
  REMOVE_TRIP: "REMOVE_TRIP",
};

const tripsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, trips: action.payload, error: null };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.REMOVE_TRIP:
      const updatedTrips = state.trips.filter((trip) => trip.trip_id !== action.payload);
      return { ...state, trips: updatedTrips };
    default:
      return state;
  }
};

function Wishlist() {
  const userDetails = useSelector((state) => state.logged.userDetails);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const backendUrl = "http://localhost:8200/crud/getwishlist";
  const addToCartUrl = "http://localhost:8200/crud/addtocart";
  const removeFromWishlistUrl = "http://localhost:8200/crud/removewishlist";
  const existsInCartUrl = "http://localhost:8200/crud/existsincart";

  const [state, dispatch] = useReducer(tripsReducer, {
    trips: [],
    loading: true,
    error: null,
  });

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
          throw new Error("Failed to fetch wishlist");
        }

        const textData = await response.text();

        if (textData.length === 0) {
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: [] });
        } else {
          const data = JSON.parse(textData);
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
        }
      } catch (err) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      }
    };

    fetchTrips();
  }, [userDetails]);

  const handleAddToCart = async (trip) => {
    if (!userDetails) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const cartResponse = await fetch(existsInCartUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userDetails.user_id, tripId: trip.trip_id }),
      });

      const cartData = await cartResponse.json();

      if (cartData) {
        alert("Trip is already in cart! Cannot add it again.");
        return;
      }

      const response = await fetch(addToCartUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userDetails.user_id, tripId: trip.trip_id }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      alert("Added to cart successfully!");

      // Remove from wishlist after adding to cart
      await handleRemoveFromWishlist(trip.trip_id);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const handleRemoveFromWishlist = async (tripId) => {
    if (!userDetails) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const response = await fetch(removeFromWishlistUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userDetails.user_id, tripId }),
      });

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      alert("Removed from wishlist successfully!");
      dispatch({ type: ACTIONS.REMOVE_TRIP, payload: tripId });
    } catch (error) {
      console.error("Error removing from wishlist:", error.message);
    }
  };

  return (
    <main>
      <div
        className="hero-section text-center text-white"
        style={{ background: "linear-gradient(45deg, #ff7e5f, #feb47b)", padding: "4rem 2rem" }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Discover Your Next Adventure</h1>
        <h3 style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
          Find the best trips and travel deals just for you!
        </h3>
      </div>

      <div className="container mt-5">
        {state.loading ? (
          <div>Loading...</div>
        ) : state.error ? (
          <div>Error: {state.error}</div>
        ) : state.trips.length === 0 ? (
          <div className="text-center">
            <h3>Your wishlist is empty.</h3>
            <p>Start exploring and add your favorite trips!</p>
          </div>
        ) : (
          <div className="row">
            {state.trips.map((trip) => (
              <div className="col-md-4 mb-4" key={trip.trip_id}>
                <div className="card h-100 shadow-lg rounded-3">
                  <img
                    src={trip.packageid.image_desc.replace(/'/g, "")}
                    className="card-img-top"
                    alt={trip.packageid.package_name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{trip.packageid.package_name}</h5>
                    <div className="d-flex justify-content-start gap-2 mt-3">
                      <button className="btn btn-success w-100" onClick={() => handleAddToCart(trip)}>
                        Add to Cart
                      </button>
                      <button className="btn btn-danger w-100" onClick={() => handleRemoveFromWishlist(trip.trip_id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
