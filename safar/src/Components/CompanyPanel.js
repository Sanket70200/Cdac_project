import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function CompanyPanel() {
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const userDetails = useSelector((state) => state.logged.userDetails);
  return (
    <Container fluid>
      {/* Admin Panel Layout */}
      <Row>
        <div
          className="hero-section text-center text-white"
          style={{
            background: 'linear-gradient(45deg, #ff7e5f, #feb47b)',
            padding: '0.3rem',
            color: '#fff',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Welcome {userDetails && userDetails.firstname ? userDetails.firstname : 'Guest'}
          </h1>
        </div>

        {/* Sidebar */}
        <Col
          xs={12} md={3} lg={3}
          className="bg-dark text-white p-3"
          style={{
            height: '100vh',
            position: 'fixed', // Fix the sidebar
            top: '0',
            left: '0',
            overflowY: 'auto', // Allow scrolling for the sidebar if content overflows
            width: '300px', // Increased width for the sidebar
          }}
        >
          <h3 className="text-center mb-4">Company Panel</h3>
          <div className="list-group">
            <Link
              to="#"
              className={`list-group-item list-group-item-action ${selectedOption === 'Dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>

            <Link
              to="displaypack"
              className={`list-group-item list-group-item-action ${selectedOption === 'viewpackage' ? 'active' : ''}`}
            >
              View Package
            </Link>

            <Link
              to="view"
              className={`list-group-item list-group-item-action ${selectedOption === 'Users' ? 'active' : ''}`}
            >
              View Trips
            </Link>

            <Link
              to="addnewpack"
              className={`list-group-item list-group-item-action ${selectedOption === 'Add new Trips' ? 'active' : ''}`}
            >
              Add New Package
            </Link>

            <Link
              to="managepack"
              className={`list-group-item list-group-item-action ${selectedOption === 'ManagePackage' ? 'active' : ''}`}
            >
              Update Packages
            </Link>

            <Link
              to="delpack"
              className={`list-group-item list-group-item-action ${selectedOption === 'deletepackage' ? 'active' : ''}`}
            >
              Delete Packages
            </Link>

            <Link
              to="addnewtrips"
              className={`list-group-item list-group-item-action ${selectedOption === 'Add new Trips' ? 'active' : ''}`}
            >
              Add New Trips
            </Link>

            <Link
              to="suspendtrips"
              className={`list-group-item list-group-item-action ${selectedOption === 'View Feedbacks' ? 'active' : ''}`}
            >
              Suspend Trips
            </Link>

            <Link
              to="logout"
              className={`list-group-item list-group-item-action ${selectedOption === 'Logout' ? 'active' : ''}`}
            >
              Logout
            </Link>
          </div>
        </Col>

        {/* Main Content */}
        <Col
          xs={12} md={9} lg={9}
          className="p-4"
          style={{
            marginLeft: '300px', // Offset content to the right of the sidebar
            overflowY: 'scroll', // Allow scrolling for the main content
            height: '100vh', // Full height for the content area
            paddingRight: '15px', // Adding padding to the right to ensure the scrollbar appears only when needed
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For Internet Explorer
          }}
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default CompanyPanel;
