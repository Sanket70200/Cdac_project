import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

function UserControlPanel() {
  const [showOptions, setShowOptions] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");

  const userDetails = useSelector(
    (state) => state.logged.userDetails
  );

  const firstLetter = userDetails?.firstname
    ? userDetails.firstname.charAt(0).toUpperCase()
    : "U";

  const username = userDetails?.firstname
    ? userDetails.firstname
    : "Guest";

  const storageKey = `profilePhoto_${
    userDetails?.username || "user"
  }`;

  useEffect(() => {
    const loadProfilePhoto = () => {
      const savedPhoto = localStorage.getItem(storageKey);
      setProfilePhoto(savedPhoto || "");
    };

    loadProfilePhoto();

    window.addEventListener(
      "profilePhotoUpdated",
      loadProfilePhoto
    );

    return () => {
      window.removeEventListener(
        "profilePhotoUpdated",
        loadProfilePhoto
      );
    };
  }, [storageKey]);

  const headerStyle = {
    backgroundColor: "rgb(0, 63, 92)",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "8px 16px",
  };

  const handleOptionClick = () => {
    setShowOptions(false);
  };

  return (
    <Container fluid className="p-0 m-0">
      <Navbar
        expand="lg"
        className="px-3 d-flex justify-content-between align-items-center w-100"
        style={{
          backgroundColor: "rgb(0, 63, 92)",
          color: "#fff",
          width: "100%",
          margin: "0",
          position: "sticky",
          top: "0",
          zIndex: "1000",
          padding: "0.5rem 1rem",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px",
        }}
      >
       <Navbar.Brand
  as={Link}
  to="/user"
  className="text-white m-0"
  style={{
    ...headerStyle,
    cursor: "pointer",
    textDecoration: "none",
  }}
>
  <img
    src="/image.png"
    alt="Safar Logo"
    style={{
      width: "140px",
      height: "30px",
      objectFit: "contain",
    }}
  />
</Navbar.Brand>

        <h2 className="text-white m-0" style={headerStyle}>
          Welcome, {username}!
        </h2>

        <div className="position-relative">
          <Button
            className="rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{
              width: "42px",
              height: "42px",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              border: "2px solid white",
              backgroundColor: "#ffffff",
              color: "#003f5c",
              overflow: "hidden",
            }}
            onClick={() => setShowOptions(!showOptions)}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              firstLetter
            )}
          </Button>

          {showOptions && (
            <div
              className="position-absolute bg-white shadow p-2 rounded"
              style={{
                right: "0px",
                top: "50px",
                zIndex: 1000,
                width: "170px",
              }}
            >
              <Link
                className="d-block p-2 text-dark text-decoration-none"
                to="MyCard"
                onClick={handleOptionClick}
              >
                View Card
              </Link>

              <Link
                className="d-block p-2 text-dark text-decoration-none"
                to="Wishlist"
                onClick={handleOptionClick}
              >
                Wishlist
              </Link>

              <Link
                className="d-block p-2 text-dark text-decoration-none"
                //to="MyBookings"
                onClick={handleOptionClick}
              >
                My Bookings
              </Link>

              <Link
                className="d-block p-2 text-dark text-decoration-none"
                //to="mytriphistroy"
                onClick={handleOptionClick}
              >
                Trip History
              </Link>

              <Link
                className="d-block p-2 text-dark text-decoration-none"
                to="MyProfile"
                onClick={handleOptionClick}
              >
                My Profile
              </Link>

              <Link
                className="d-block p-2 text-dark text-decoration-none"
                to="logout"
                onClick={handleOptionClick}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </Navbar>

      <div>
        <Outlet />
      </div>
    </Container>
  );
}

export default UserControlPanel;