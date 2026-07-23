import React, { useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Alert } from "react-bootstrap";

const initialState = {
  packages: [],
  error: null,
  success: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: action.payload, error: null, success: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, success: null };
    case "SET_SUCCESS":
      return { ...state, success: action.payload, error: null };
    case "UPDATE_PACKAGE_STATUS":
      return {
        ...state,
        packages: state.packages.map(pkg =>
          pkg.packageid === action.payload.packageid
            ? { ...pkg, package_status: 0 } // Update the status to 0 (soft delete)
            : pkg
        ),
      };
    default:
      return state;
  }
}

const DeletePackage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userDetails = useSelector((state) => state.logged?.userDetails);
  const userid = userDetails?.user_id;

  useEffect(() => {
    if (userid) {
      fetchPackages();
    }
  }, [userid]);

  const fetchPackages = () => {
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
          dispatch({ type: "SET_ERROR", payload: "No packages found" });
        }
      })
      .catch((error) => {
        dispatch({ type: "SET_ERROR", payload: "Error fetching data" });
        console.error(error); // Log error for debugging
      });
  };

  const handleDeletePackage = (packageid) => {
    // Create the object with packageid for the request
    const packageData = { packageid };

    fetch("http://localhost:8200/crud/deletePackage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packageData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === 1) { // If the backend returns 1 for success
          dispatch({ type: "UPDATE_PACKAGE_STATUS", payload: { packageid } });
          dispatch({ type: "SET_SUCCESS", payload: "Package deleted successfully" });

          // Re-fetch packages after deletion
          fetchPackages();
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to delete package" });
        }
      })
      .catch((error) => {
        dispatch({ type: "SET_ERROR", payload: "Error deleting package" });
        console.error(error); // Log error for debugging
      });
  };

  return (
    <div className="container mt-4">
      {/* Show success message */}
      {state.success && <Alert variant="success">{state.success}</Alert>}

      {/* Show error message */}
      {state.error && <Alert variant="danger">{state.error}</Alert>}

      {/* Table for displaying packages */}
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
                {pkg.package_status === 1 ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePackage(pkg.packageid)}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled>
                    Deleted
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DeletePackage;
