import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { useSelector } from "react-redux";
import { MoveRight } from 'lucide-react';



function AdminPanel() {
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const userDetails = useSelector((state) => state.logged.userDetails);
  return (  
    <Container fluid >
      {/* Admin Panel Layout */}
      <Row>
      <div className="hero-section text-center text-white" style={{ background: 'linear-gradient(45deg, #ff7e5f, #feb47b)',padding: '0.3rem', color: '#fff' }}>
      <h1
  style={{
    fontSize: '2rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)'
  }}
>
  Welcome {userDetails && userDetails.firstname ? userDetails.firstname : 'Guest'}
</h1></div>
        {/* Sidebar */}

        <Col xs={3} className="bg-dark text-white vh-100 p-3" >
         
          <div className="list-group" >
            <Link
              to="#"
              className={`list-group-item list-group-item-action ${selectedOption === 'Dashboard' ? 'active' : ''}`}
              
            >
              Dashboard
            </Link>

            <Link
              to="managetrips"
              className={`list-group-item list-group-item-action ${selectedOption === 'View trips' ? 'active' : ''}`}
              
            >
              Manage Trips
            </Link>
            <Link
              to="Approvecompanies"
              className={`list-group-item list-group-item-action ${selectedOption === 'View trips' ? 'active' : ''}`}
              
            >
              Approve Companies
            </Link>

            <Link
              to="Sus"
              className={`list-group-item list-group-item-action ${selectedOption === 'View trips' ? 'active' : ''}`}
              
            >
              Suspend Companies
            </Link>

            <Link
              to="approveuser"
              className={`list-group-item list-group-item-action ${selectedOption === 'View users' ? 'active' : ''}`}
              
            >
              Approve Users
            </Link>

            <Link
              to="suspendusers"
              className={`list-group-item list-group-item-action ${selectedOption === 'View trips' ? 'active' : ''}`}
              
            >
              Suspend Users
            </Link>

            <Link
              to="newadmin"
              className={`list-group-item list-group-item-action ${selectedOption === 'Add new Admin' ? 'active' : ''}`}
              
            >
              Add new Admin
            </Link>

            <Link
              to="logout"
              className={`list-group-item list-group-item-action ${selectedOption === 'Logout' ? 'active' : ''}`}
              
            >
              Logout
            </Link>

            
          </div>
        </Col>

        <Col xs={9} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPanel;
