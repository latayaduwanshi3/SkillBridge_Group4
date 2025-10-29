// Frontend/src/pages/ForgotPassword.js
import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.msg);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error sending OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Send OTP
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ForgotPassword;
