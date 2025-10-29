// Frontend/src/pages/VerifyOtp.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp });
      setMessage(res.data.msg);
      alert("OTP verified! You can now reset your password.");
      navigate("/reset-password", { state: { email } }); // redirect to reset password page
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error verifying OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Verify OTP</h2>
      <p>We sent an OTP to your email: <b>{email}</b></p>
      <p>Time left: {formatTime(timeLeft)}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }} disabled={timeLeft <= 0}>
          Verify OTP
        </button>
      </form>
      {timeLeft <= 0 && <p style={{ color: "red" }}>OTP expired! Please request a new one.</p>}
      <p>{message}</p>
    </div>
  );
}

export default VerifyOtp;
