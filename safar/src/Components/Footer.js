import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-dark text-white text-center text-lg-start mt-4 py-3">
            <div className="container">
                <p className="mb-0">
                    &copy; 2025 Travel Agency. All rights reserved. |{' '}
                    <Link to="/privacy-policy" className="text-warning">Privacy Policy</Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
