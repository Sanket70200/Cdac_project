
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function MyProfile() {
  const userDetails = useSelector(
    (state) => state.logged?.userDetails
  );

  const fileInputRef = useRef(null);

  const [profilePhoto, setProfilePhoto] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const username = userDetails?.username || "user";
  const storageKey = `profilePhoto_${username}`;

  useEffect(() => {
    const savedPhoto = localStorage.getItem(storageKey);

    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!userDetails) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center shadow-sm">
          User details are unavailable. Please log in again.
        </div>
      </div>
    );
  }

  const firstName = userDetails.firstname || "";
  const lastName = userDetails.lastname || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || "Safar User";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
    .trim()
    .toUpperCase() || "U";

  const getValue = (value) => {
    return value && String(value).trim()
      ? value
      : "Not available";
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  /*
   * Crops the selected image into a square and
   * resizes it to 500 × 500 pixels.
   */
  const resizeAndCropImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          const outputSize = 500;

          canvas.width = outputSize;
          canvas.height = outputSize;

          const sourceSize = Math.min(
            image.naturalWidth,
            image.naturalHeight
          );

          const sourceX =
            (image.naturalWidth - sourceSize) / 2;

          const sourceY =
            (image.naturalHeight - sourceSize) / 2;

          // White background for transparent images
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, outputSize, outputSize);

          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            outputSize,
            outputSize
          );

          const resizedImage = canvas.toDataURL(
            "image/jpeg",
            0.88
          );

          resolve(resizedImage);
        };

        image.onerror = () => {
          reject(new Error("Unable to read the selected image."));
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        reject(new Error("Unable to read the selected file."));
      };

      reader.readAsDataURL(file);
    });
  };

  const processSelectedFile = async (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      showMessage(
        "Please select a valid image file.",
        "danger"
      );
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      showMessage(
        "Image size must be less than 2 MB.",
        "danger"
      );
      return;
    }

    try {
      setIsProcessing(true);

      const resizedImage =
        await resizeAndCropImage(selectedFile);

      setProfilePhoto(resizedImage);
      localStorage.setItem(storageKey, resizedImage);

      showMessage("Profile photo updated successfully.");
    } catch (error) {
      showMessage(
        error.message || "Unable to process the image.",
        "danger"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processSelectedFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    processSelectedFile(selectedFile);
  };

  const removeProfilePhoto = () => {
    setProfilePhoto("");
    localStorage.removeItem(storageKey);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    showMessage("Profile photo removed successfully.");
  };

  return (
    <div
      className="container py-5"
      style={{ minHeight: "80vh" }}
    >
      {message && (
        <div
          className={`alert alert-${messageType} alert-dismissible fade show mx-auto shadow-sm`}
          role="alert"
          style={{
            maxWidth: "900px",
            borderRadius: "10px",
          }}
        >
          {message}

          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
            aria-label="Close"
          />
        </div>
      )}

      <div
        className="card border-0 shadow mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "18px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Profile Header */}
        <div
          className="d-flex flex-column flex-md-row align-items-center p-4 p-md-5"
          style={{
            background:
              "linear-gradient(135deg, #003f5c 0%, #006b8f 100%)",
          }}
        >
          {/* Profile Image Area */}
          <div
            className="position-relative"
            onMouseEnter={() => setIsPhotoHovered(true)}
            onMouseLeave={() => setIsPhotoHovered(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderRadius: "50%",
              padding: isDragging ? "5px" : "0",
              border: isDragging
                ? "3px dashed #ffffff"
                : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <button
              type="button"
              onClick={handlePhotoClick}
              className="border-0 p-0 bg-transparent"
              title="Click or drag an image to change profile photo"
              aria-label="Change profile photo"
              disabled={isProcessing}
              style={{
                position: "relative",
                borderRadius: "50%",
                cursor: isProcessing
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`${fullName} profile`}
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center",
                    border: "5px solid #ffffff",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 8px 24px rgba(0, 0, 0, 0.25)",
                    transform: isPhotoHovered
                      ? "scale(1.04)"
                      : "scale(1)",
                    transition:
                      "transform 0.25s ease, filter 0.25s ease",
                    filter: isPhotoHovered
                      ? "brightness(0.75)"
                      : "brightness(1)",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    color: "#003f5c",
                    fontSize: "40px",
                    border: "5px solid #ffffff",
                    boxShadow:
                      "0 8px 24px rgba(0, 0, 0, 0.25)",
                    transform: isPhotoHovered
                      ? "scale(1.04)"
                      : "scale(1)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  {initials}
                </div>
              )}

              {isPhotoHovered && !isProcessing && (
                <div
                  className="position-absolute top-50 start-50 translate-middle text-white fw-semibold"
                  style={{
                    zIndex: 2,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profilePhoto ? "Change Photo" : "Add Photo"}
                </div>
              )}

              {isProcessing && (
                <div
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{ zIndex: 3 }}
                >
                  <div
                    className="spinner-border text-light"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Processing...
                    </span>
                  </div>
                </div>
              )}

              <span
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  right: "2px",
                  bottom: "4px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: "#003f5c",
                  border: "2px solid #e5e5e5",
                  boxShadow:
                    "0 3px 8px rgba(0, 0, 0, 0.2)",
                  fontSize: "17px",
                  zIndex: 4,
                }}
              >
                ✎
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>

          {/* User Heading */}
          <div className="ms-md-4 mt-4 mt-md-0 text-white text-center text-md-start">
            <h2 className="mb-1 fw-bold">{fullName}</h2>

            <p className="mb-2 opacity-75">
              @{getValue(userDetails.username)}
            </p>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: "#198754",
                fontSize: "13px",
              }}
            >
              ● Active Account
            </span>

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-light btn-sm me-2 px-3"
                onClick={handlePhotoClick}
                disabled={isProcessing}
              >
                {profilePhoto ? "Change Photo" : "Upload Photo"}
              </button>

              {profilePhoto && (
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={removeProfilePhoto}
                  disabled={isProcessing}
                >
                  Remove
                </button>
              )}
            </div>

            <small className="d-block mt-3 opacity-75">
              Click the photo or drag and drop an image.
            </small>
          </div>
        </div>

        {/* Profile Content */}
        <div className="card-body p-4 p-md-5">
          <div className="mb-4">
            <h4 className="fw-bold mb-1">
              Personal Information
            </h4>

            <p className="text-muted mb-0">
              Details associated with your Safar account.
            </p>
          </div>

          <div className="row g-4">
            <ProfileField
              icon="👤"
              label="Username"
              value={getValue(userDetails.username)}
            />

            <ProfileField
              icon="✉"
              label="Email Address"
              value={getValue(userDetails.email)}
            />

            <ProfileField
              icon="🪪"
              label="First Name"
              value={getValue(userDetails.firstname)}
            />

            <ProfileField
              icon="🪪"
              label="Last Name"
              value={getValue(userDetails.lastname)}
            />

            <ProfileField
              icon="☎"
              label="Contact Number"
              value={getValue(userDetails.contactno)}
            />

            <ProfileField
              icon="⌂"
              label="Address"
              value={getValue(userDetails.address)}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 px-md-5 py-3"
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <small className="text-muted">
            Accepted formats: JPG, JPEG, PNG and WEBP.
            Maximum file size: 2 MB. Images are automatically
            resized and cropped.
          </small>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="col-12 col-md-6">
      <div
        className="p-3 h-100 d-flex align-items-start"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered
            ? "#eef8fc"
            : "#f8f9fa",
          border: isHovered
            ? "1px solid #78b7cf"
            : "1px solid #e4e7ea",
          borderRadius: "12px",
          transform: isHovered
            ? "translateY(-3px)"
            : "translateY(0)",
          boxShadow: isHovered
            ? "0 7px 18px rgba(0, 63, 92, 0.12)"
            : "none",
          transition: "all 0.22s ease",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            fontSize: "20px",
          }}
        >
          {icon}
        </div>

        <div>
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
            className="text-dark fw-medium"
            style={{
              fontSize: "16px",
              wordBreak: "break-word",
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
