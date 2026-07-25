import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Components/Register";
import Safar_login from "./Components/Login";
import { useSelector } from "react-redux";
import AdminPanel from "./Components/Admin";
import Logout from "./Components/logout";
import CompanyPanel from "./Components/CompanyPanel";
import AdminRegister from "./Components/NewAdmin";
import Trips from "./Components/ShowTripsForAdmin";
import AddPackageForm from "./Components/AddNewPackageforCompany";
import UsersManagement from "./Components/UsersManagement";
import AddTour from "./Components/AddTripDetails";
import PackageManager1 from "./Components/UpdatePackage";
import DeletePackage from "./Components/deletepackage";
import PackageDisplay from "./Components/viewpackages";
import ViewTripFeedback from "./Components/viewfeedbackforcomp";
import CompanyViewTrips from "./Components/Companyviewtrips";
import UserPage from "./Components/UserPage";
import ForgotPassword from "./Components/Safar_ForgetPass";
import Main from "./Components/Landing";
import UserControlPanel from "./Components/UserControlPanel";
import Wishlist from "./Components/Wishlist";
import Card from "./Components/Card";
import ApprovedCompanies from "./Components/ApprovedCompanies";
import SuspendCom from "./Components/SuspendCom";
import AboutUs from "./Components/aboutus";
import ApprovedUsers from "./Components/approveuser";
import SuspendUsers from "./Components/suspenduser";
import MyBookings from "./Components/MyBooking";
import MyBookingsHistory from "./Components/paymenthistory";
import UserFeedback from "./Components/UserFeedback";

import MyProfile from "./Components/MyProfile";

function App() {
  const myState = useSelector((state) => state.logged);

  return (
    <div>
      <div style={{ display: myState.loggedIn ? "none" : "block" }}>
        {/* Navigation Bar */}
        <nav style={styles.navBar}>
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Brand */}
            <Link
              to="/"
              className="navbar-brand text-white fw-bold d-flex align-items-center"
            >
              <img
                        src="/image.png"
                        alt="Safar Logo"
                        style={{
                            width: "120px",
                            height: "30px",
                            objectFit: "contain"
                        }}
                    /> 
            </Link>

            {/* Navigation Links */}
            <ul style={styles.navList}>
              <li>
                <Link to="/" style={styles.navLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" style={styles.navLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" style={styles.navLink}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" style={styles.navLink}>
                  Signup
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Safar_login />} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/admin" element={<AdminPanel />}>
          <Route path="managetrips" element={<Trips />} />
          <Route path="Approvecompanies" element={<ApprovedCompanies />} />
          <Route path="Sus" element={<SuspendCom />} />
          <Route path="suspendusers" element={<SuspendUsers />} />
          <Route path="newadmin" element={<AdminRegister />} />
          <Route path="logout" element={<Logout />} />
          <Route path="approveuser" element={<ApprovedUsers />} />
        </Route>

        <Route path="/user" element={<UserControlPanel />}>
          <Route index element={<UserPage />} />
          <Route path="Wishlist" element={<Wishlist />} />
          <Route path="logout" element={<Logout />} />
          <Route path="MyCard" element={<Card />} />
          <Route path="MyBookings" element={<MyBookings />} />
          <Route path="mytriphistroy" element={<MyBookingsHistory />} />
          <Route path="MyFeedback" element={<UserFeedback />} />
          <Route path="MyProfile" element={<MyProfile />} />
        </Route>

        <Route path="/company" element={<CompanyPanel />}>
          <Route path="view" element={<CompanyViewTrips />} />
          <Route path="addnewpack" element={<AddPackageForm />} />
          <Route path="addnewtrips" element={<AddTour />} />
          <Route path="logout" element={<Logout />} />
          <Route path="managepack" element={<PackageManager1 />} />
          <Route path="delpack" element={<DeletePackage />} />
          <Route path="displaypack" element={<PackageDisplay />} />
          <Route path="feedback" element={<ViewTripFeedback />} />
          <Route path="suspendtrips" element={<Trips />} />
        </Route>
      </Routes>
    </div>
  );
}

const styles = {
  navBar: {
    backgroundColor: "#003f5c",
    padding: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navList: {
    display: "flex",
    justifyContent: "flex-end",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    gap: "1rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#ffffff",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    borderRadius: "5px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  navLinkHover: {
    backgroundColor: "#ff7e5f",
    color: "#ffffff",
  },
};

export default App;
