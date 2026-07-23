import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Button, Container, Alert } from "react-bootstrap";

const AddPackageForm = () => {
  const userDetails = useSelector((state) => state.logged?.userDetails);
  const userid = userDetails?.user_id;
  console.log("User ID:", userid);

  const [formData, setFormData] = useState({
    package_name: "",
    source: "",
    destination: "",
    description: "",
    image_desc: "",
    person_per_package: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const dataToSend = {
      userid,
      ...formData,
      person_per_package: parseFloat(formData.person_per_package), // Convert to float
    };

    console.log("Form Data Submitted:", dataToSend);

    try {
      const response = await fetch("http://localhost:8200/crud/addpackage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.text(); // Read response as text

      if (response.ok && responseData.includes("successfully")) {
        setSuccess("Package added successfully!");
        setError(null);
        handleReset();
      } else {
        setError("Failed to add package: " + responseData);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error: Could not connect to the server.");
    }
  };

  const handleReset = () => {
    setFormData({
      package_name: "",
      source: "",
      destination: "",
      description: "",
      image_desc: "",
      person_per_package: "",
    });
  };

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <div className="w-50 p-4 border rounded shadow">
        <h2 className="text-center">Add New Package</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Package Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.package_name}
              onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image Description</Form.Label>
            <Form.Control
              type="text"
              value={formData.image_desc}
              onChange={(e) => setFormData({ ...formData, image_desc: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Persons Per Package</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={formData.person_per_package}
              onChange={(e) => setFormData({ ...formData, person_per_package: e.target.value })}
              required
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" type="submit">
              Add Package
            </Button>
            <Button variant="secondary" className="ms-2" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default AddPackageForm;