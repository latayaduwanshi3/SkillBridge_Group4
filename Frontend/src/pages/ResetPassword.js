import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        newPassword,
      });

      setMessage(res.data.msg);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Reset Password
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ResetPassword;
