import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const PaymentForm = ({ 
  userId, 
  tripId, 
  totalPrice, 
  bookingCount, 
  email, 
  userName, 
  tripDetails, 
  travelerDetails, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = formData;
    const cardRegex = /^[0-9]{16}$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

    let newErrors = {};

    if (!cardHolder.trim()) newErrors.cardHolder = "Cardholder name is required.";
    if (!cardRegex.test(cardNumber)) newErrors.cardNumber = "Invalid card number (16 digits required).";
    if (!expiryRegex.test(expiryDate)) newErrors.expiryDate = "Invalid expiry date (MM/YY).";
    if (!cvvRegex.test(cvv)) newErrors.cvv = "Invalid CVV (3-4 digits required).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch("http://localhost:8200/crud/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      setOtpSent(true);
      Swal.fire("OTP Sent", "Check your email for the OTP", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP. Try again!", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOtpAndProcessPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire("Validation Error", "Please fix the errors and try again.", "error");
      return;
    }

    try {
      setIsProcessing(true);
      
      const otpResponse = await fetch("http://localhost:8200/crud/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!otpResponse.ok) throw new Error("Invalid OTP!");

      // Proceed with booking
      await fetch("http://localhost:8200/crud/savebooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, userId, paymentStatus: "Paid", noOfBookings: bookingCount, amount: totalPrice }),
      });

      await fetch("http://localhost:8200/crud/updateTouristAllowed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, numTourists: bookingCount }),
      });

      const formattedTravelers = travelerDetails.map(traveler => ({
        userId, age: traveler.age || 0, gender: traveler.gender || "", adharNo: traveler.adharNo || "", tripId, firstName: traveler.firstName || "", lastName: traveler.lastName || ""
      }));

      await fetch("http://localhost:8200/crud/savetorist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedTravelers),
      });

      await fetch("http://localhost:8200/crud/send-booking-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName, tripDetails }),
      });

      await fetch("http://localhost:8200/crud/removecart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, userId }),
      });

      Swal.fire("Success", "Payment Successful! Booking confirmed.", "success").then(() => {
        onClose();
      });
    } catch (error) {
      Swal.fire("Payment Failed", error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px", borderRadius: "12px" }}>
        <h2 className="text-center mb-3 text-primary">Secure Payment</h2>
        <p className="text-center"><strong>Total Amount:</strong> ₹{totalPrice}</p>

        {/* Card Logos */}
        <div className="text-center mb-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" width="50" className="mx-2" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" width="50" className="mx-2" />
          
        </div>

        <form onSubmit={verifyOtpAndProcessPayment}>
          <input type="text" name="cardHolder" className="form-control mb-2" placeholder="Cardholder Name" value={formData.cardHolder} onChange={handleChange} required />
          {errors.cardHolder && <small className="text-danger">{errors.cardHolder}</small>}

          <input type="text" name="cardNumber" className="form-control mb-2" placeholder="Card Number" value={formData.cardNumber} onChange={handleChange} maxLength={16} required />
          {errors.cardNumber && <small className="text-danger">{errors.cardNumber}</small>}

          <div className="d-flex gap-2">
            <input type="text" name="expiryDate" className="form-control" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} maxLength={5} required />
            <input type="password" name="cvv" className="form-control" placeholder="CVV" value={formData.cvv} onChange={handleChange} maxLength={4} required />
          </div>
          {errors.expiryDate && <small className="text-danger">{errors.expiryDate}</small>}
          {errors.cvv && <small className="text-danger">{errors.cvv}</small>}

          {!otpSent ? (
            <button type="button" className="btn btn-warning w-100 mt-3" onClick={sendOtp} disabled={isProcessing}>{isProcessing ? "Sending OTP..." : "Send OTP"}</button>
          ) : (
            <>
              <input type="text" className="form-control my-2" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
              <button type="submit" className="btn btn-success w-100" disabled={isProcessing}>{isProcessing ? "Processing..." : "Verify & Pay"}</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
