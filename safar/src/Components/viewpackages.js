import React, { useReducer, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col, Alert, Form, Container } from "react-bootstrap";

const initialState = {
  packages: [],
  filteredPackages: [],
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: action.payload, filteredPackages: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: "Cannot fetch data" };
    case "FILTER_PACKAGES":
      return { ...state, filteredPackages: action.payload };
    default:
      return state;
  }
}

const PackageDisplay = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const userDetails = useSelector((state) => state.logged?.userDetails);
  const userid = userDetails?.user_id;

  useEffect(() => {
    if (userid) {
      fetch("http://localhost:8200/crud/getpackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      })
        .then((res) => res.json())
        .then((data) => {
          const packages = Array.isArray(data) ? data : data.data || [];
          if (packages.length > 0) {
            dispatch({ type: "SET_PACKAGES", payload: packages });
          } else {
            dispatch({ type: "SET_ERROR" });
          }
        })
        .catch(() => dispatch({ type: "SET_ERROR" }));
    }
  }, [userid]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredPackages = state.packages.filter(pkg =>
      pkg.package_name.toLowerCase().includes(term) ||
      pkg.source.toLowerCase().includes(term) ||
      pkg.destination.toLowerCase().includes(term) ||
      pkg.description.toLowerCase().includes(term)
    );

    dispatch({ type: "FILTER_PACKAGES", payload: filteredPackages });
  };

  return (
    <Container className="mt-4">
      {state.error && <Alert variant="danger">{state.error}</Alert>}

      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search Packages..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      {/* Package Cards */}
      <Row className="g-4">
        {state.filteredPackages.map((pkg, index) => (
          <Col key={pkg.packageid} xs={12} sm={6} md={4}>
            <Card style={{
              width: "100%", 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
              transition: "transform 0.3s ease, box-shadow 0.3s ease", 
              borderRadius: "10px"
            }} 
            className="package-card"
            >
              <Card.Img 
                variant="top" 
                src={pkg.image_desc} 
                style={{ height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} 
              />
              <Card.Body style={{ padding: "15px" }}>
                <Card.Title style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  {pkg.package_name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "1rem", marginBottom: "10px" }}>
                  {pkg.source} &rarr; {pkg.destination}
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "10px" }}>
                  {pkg.description}
                </Card.Text>
                <Card.Text style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                  <strong>Persons Per Package: </strong>{pkg.person_per_package}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PackageDisplay;
