import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
    skills: "",
    organization_name: "",
    organization_description: "",
    website_url: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/register", formData);
      alert("Account created successfully!");
      navigate("/signin"); // redirect to login page
    } 
    catch (err) {
  console.error("Backend response:", err.response?.data); 
  console.error("Full error:", err);
  // alert(err.response?.data?.message || "Error creating account");
  alert(err.response?.data?.msg || "Error creating account");
}
  };

  return (
    <div className="page signup-page">
      <div className="logo-header">
        <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
      </div>

      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", textAlign: "left", marginBottom: "1.5px" }}>
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Enter your Username"
          required
          onChange={handleChange}
        />
        <label style={{ display: "block", textAlign: "left", marginBottom: "1.5px" }}>
          Full Name
        </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your Full Name"
            required
            onChange={handleChange}
          />
          <label style={{ display: "block", textAlign: "left", marginBottom: "1.5px" }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          required
          onChange={handleChange}
        />
        <label style={{ display: "block", textAlign: "left", marginBottom: "1.5px" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Create a Password"
          required
          onChange={handleChange}
        />
        <label style={{ display: "block", textAlign: "left", marginBottom: "1.5px" }}>
          I am a
        </label>
        <select name="role" required onChange={handleChange}>
          <option value="">I am a...</option>
          <option value="volunteer">Volunteer</option>
          <option value="ngo">NGO / Organization</option>
        </select>

        {/* ✅ Show Volunteer fields */}
        {formData.role === "volunteer" && (
          <>
            <input
              type="text"
              name="location"
              placeholder="Location (Optional)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (Optional, comma separated)"
              onChange={handleChange}
            />
          </>
        )}

        {/* ✅ Show NGO fields */}
        {formData.role === "ngo" && (
          <>
          <div className="flex-box">
            <input
              type="text"
              name="location"
              placeholder="Location (Optional)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="organization_name"
              placeholder="Organization Name"
              onChange={handleChange}
            />
            </div>
            <div className="flex-box">
            <textarea
              name="organization_description"
              placeholder="Organization Description"
              onChange={handleChange}
            ></textarea>
            <input
              type="url"
              name="website_url"
              placeholder="Website URL (Optional)"
              onChange={handleChange}
            />
            </div>
          </>
        )}

        <button type="submit">Create Account</button>
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

