import React, { useReducer, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Form, Table, Alert } from "react-bootstrap";

const initialState = {
  packages: [],
  selectedPackage: null,
  error: null,
  success: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: action.payload, error: null, success: null };
    case "SET_ERROR":
      return { ...state, error: action.payload || "Cannot fetch data", success: null };
    case "SET_SUCCESS":
      return { ...state, success: action.payload, error: null };
    case "UPDATE_PACKAGE":
      return {
        ...state,
        packages: state.packages.map((pkg) =>
          pkg.packageid === action.payload.packageid ? action.payload : pkg
        ),
      };
    case "SELECT_PACKAGE":
      return { ...state, selectedPackage: action.payload };
    case "CLEAR_SELECTION":
      return { ...state, selectedPackage: null };
    default:
      return state;
  }
}

const PackageManager1 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    package_id: "",
    package_name: "",
    source: "",
    destination: "",
    description: "",
    image_desc: "",
    person_per_package: "",
  });

  const userDetails = useSelector((state) => state.logged?.userDetails);
  const userid = userDetails?.user_id;

  useEffect(() => {
    if (!userid) return;

    fetch("http://localhost:8200/crud/getpackages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        const packages = Array.isArray(data) ? data : data.data || [];
        dispatch({ type: "SET_PACKAGES", payload: packages });
      })
      .catch(() => dispatch({ type: "SET_ERROR", payload: "Failed to fetch packages" }));
  }, [userid]);

  const handleUpdatePackage = (pkg) => {
    setFormData({
      package_id: pkg.packageid,
      package_name: pkg.package_name,
      source: pkg.source,
      destination: pkg.destination,
      description: pkg.description,
      image_desc: pkg.image_desc,
      person_per_package: pkg.person_per_package,
    });
    dispatch({ type: "SELECT_PACKAGE", payload: pkg });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (isNaN(formData.person_per_package) || formData.person_per_package <= 0) {
      dispatch({ type: "SET_ERROR", payload: "Persons per package must be a positive number." });
      return;
    }

    const packageData = { ...formData, userid };

    fetch("http://localhost:8200/crud/updatePackage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packageData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then((text) => {
            throw new Error(text || "Failed to update package");
          });
        }
      })
      .then((data) => {
        if (data === "Package updated successfully") {
          // Close the modal
          setShowUpdateModal(false);

          // Dispatch the updated package to Redux
          dispatch({ type: "UPDATE_PACKAGE", payload: packageData });

          // Show success alert
          dispatch({ type: "SET_SUCCESS", payload: "Package updated successfully" });

          // Optionally, re-fetch packages to ensure UI is up-to-date
          fetch("http://localhost:8200/crud/getpackages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid }),
          })
            .then((res) => res.json())
            .then((data) => {
              const packages = Array.isArray(data) ? data : data.data || [];
              dispatch({ type: "SET_PACKAGES", payload: packages });
            })
            .catch(() => dispatch({ type: "SET_ERROR", payload: "Failed to fetch packages after update" }));

          // Clear form data
          setFormData({
            package_id: "",
            package_name: "",
            source: "",
            destination: "",
            description: "",
            image_desc: "",
            person_per_package: "",
          });
        }
      })
      .catch((error) => {
        dispatch({ type: "SET_ERROR", payload: error.message || "Update failed" });
      });
  };

  return (
    <div className="container mt-4">
      {state.error && <Alert variant="danger">{state.error}</Alert>}
      {state.success && <Alert variant="success">{state.success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            
            <th>Package Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Description</th>
            <th>Persons Per Package</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.packages.map((pkg) => (
            <tr key={pkg.packageid}>
              <td>{pkg.package_name}</td>
              <td>{pkg.source}</td>
              <td>{pkg.destination}</td>
              <td>{pkg.description}</td>
              <td>{pkg.person_per_package}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleUpdatePackage(pkg)}>
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            {Object.keys(formData).map((key) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{key.replace(/_/g, " ").toUpperCase()}</Form.Label>
                <Form.Control
                  type={key === "person_per_package" ? "number" : "text"}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PackageManager1;
