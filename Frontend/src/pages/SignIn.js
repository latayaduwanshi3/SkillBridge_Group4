// import React from "react";
// import { Link } from "react-router-dom";
// import "./Auth.css";
// import logo from "../assets/logo.png";

// const SignIn = () => {
//   return (
//     <div className="auth-container">
//       {/* Logo top-left */}
//       <div className="logo-header">
//         <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
//         <h3 className="auth-brand">SkillBridge NGO</h3>
//       </div>

//       <div className="auth-box">
//         <h2>Sign In</h2>
//         <input type="text" placeholder="Username" />
//         <input type="password" placeholder="Password" />
//         <button>Submit</button>

//         <p>
//           <Link to="/forgot-password" className="link forgot">
//             Forgot Password?
//           </Link>
//         </p>
//         <p>
//           Don’t have an account?{" "}
//           <Link to="/signup" className="link">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import logo from "../assets/logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ added password state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.msg || "Server error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-header">
        <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
      </div>

      <div className="auth-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password} // ✅ added value
            onChange={(e) => setPassword(e.target.value)} // ✅ added onChange
            required
          />
          <button type="submit">Submit</button>
        </form>

        <p>
          <Link to="/forgot-password" className="link forgot">
            Forgot Password?
          </Link>
        </p>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
