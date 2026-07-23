import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark"
            style={{
                backgroundColor: "#003f5c",
                padding: "12px 20px"
            }}
        >
            <div className="container-fluid">

                <Link
                    to="/"
                    className="navbar-brand d-flex align-items-center gap-2"
                >
                    <img
                        src="/image.png"
                        alt="Safar Logo"
                        style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "contain"
                        }}
                    />

                    <span className="fw-bold fs-3 text-white">
                        Safar
                    </span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className="nav-link text-white"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/about"
                                className="nav-link text-white"
                            >
                                About
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav align-items-lg-center">
                        <li className="nav-item">
                            <Link
                                to="/login"
                                className="nav-link text-white"
                            >
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/signup"
                                className="btn btn-warning ms-lg-3 fw-bold"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;