import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function MyProfile() {
  const userDetails = useSelector(
    (state) => state.logged?.userDetails
  );

  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState("");

  const username = userDetails?.username || "user";
  const storageKey = `profilePhoto_${username}`;

  useEffect(() => {
    const savedPhoto = localStorage.getItem(storageKey);

    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [storageKey]);

  if (!userDetails) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          User details are unavailable. Please log in again.
        </div>
      </div>
    );
  }

  const firstName = userDetails.firstname || "";
  const lastName = userDetails.lastname || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || "User";

  const firstLetter = firstName
    ? firstName.charAt(0).toUpperCase()
    : "U";

  const getValue = (value) => {
    return value && String(value).trim()
      ? value
      : "Not available";
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Maximum photo size: 2 MB
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfilePhoto(imageData);
      localStorage.setItem(storageKey, imageData);
    };

    reader.readAsDataURL(selectedFile);
  };

  const removeProfilePhoto = () => {
    setProfilePhoto("");
    localStorage.removeItem(storageKey);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card border-0 shadow-sm mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Profile Header */}
        <div
          className="d-flex flex-column flex-md-row align-items-center p-4"
          style={{
            backgroundColor: "#003f5c",
          }}
        >
          {/* Profile Photo */}
          <div className="position-relative">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="border-0 p-0 bg-transparent"
              title="Change profile photo"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`${fullName} profile`}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #ffffff",
                    backgroundColor: "#ffffff",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-white fw-bold"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    color: "#003f5c",
                    fontSize: "34px",
                    border: "4px solid #ffffff",
                  }}
                >
                  {firstLetter}
                </div>
              )}

              <span
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  width: "30px",
                  height: "30px",
                  right: "2px",
                  bottom: "2px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: "#003f5c",
                  border: "1px solid #dddddd",
                  fontSize: "14px",
                }}
              >
                ✎
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="ms-md-4 mt-3 mt-md-0 text-white text-center text-md-start">
            <h3 className="mb-1">{fullName}</h3>

            <p className="mb-2 opacity-75">
              @{getValue(userDetails.username)}
            </p>

            <span
              className="badge"
              style={{
                backgroundColor: "#198754",
                fontSize: "13px",
              }}
            >
              Active Account
            </span>

            <div className="mt-3">
              <button
                type="button"
                className="btn btn-sm btn-light me-2"
                onClick={handlePhotoClick}
              >
                {profilePhoto ? "Change Photo" : "Add Photo"}
              </button>

              {profilePhoto && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={removeProfilePhoto}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="card-body p-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-1">
              Personal Information
            </h5>

            <p className="text-muted mb-0">
              Basic details associated with your Safar account.
            </p>
          </div>

          <div className="row g-4">
            <ProfileField
              label="Username"
              value={getValue(userDetails.username)}
            />

            <ProfileField
              label="Email Address"
              value={getValue(userDetails.email)}
            />

            <ProfileField
              label="First Name"
              value={getValue(userDetails.firstname)}
            />

            <ProfileField
              label="Last Name"
              value={getValue(userDetails.lastname)}
            />

            <ProfileField
              label="Contact Number"
              value={getValue(userDetails.contactno)}
            />

            <ProfileField
              label="Address"
              value={getValue(userDetails.address)}
            />
          </div>
        </div>

        <div
          className="px-4 py-3"
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <small className="text-muted">
            Accepted formats: JPG, JPEG, PNG and WEBP. Maximum size: 2 MB.
          </small>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="col-12 col-md-6">
      <div
        className="p-3 h-100"
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #e4e7ea",
          borderRadius: "8px",
        }}
      >
        <div
          className="text-muted mb-1"
          style={{
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          {label}
        </div>

        <div
          className="text-dark"
          style={{
            fontSize: "16px",
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;