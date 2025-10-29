import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../App.css"; // Assuming Auth.css styles are in App.css

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    skills: "",
    organization_name: "",
    organization_description: "",
    website_url: "",
  });
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setUserRole(decoded.user.role);

        const res = await axios.get("/api/auth/me", {
          headers: { "x-auth-token": token },
        });

        const user = res.data.user;

        // Populate the form data with the current user's details
        setFormData({
          name: user.name,
          location: user.location,
          skills: (user.skills || []).join(", "),
          organization_name: user.organization_name,
          organization_description: user.organization_description,
          website_url: user.website_url,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.user.id;
      
      const updatedData = { ...formData };
      if (userRole === 'volunteer') {
        updatedData.skills = updatedData.skills.split(",").map(skill => skill.trim());
      }

      await axios.put(`/api/auth/profile/${userId}`, updatedData, {
        headers: { "x-auth-token": token },
      });

      alert("Profile updated successfully!");
      navigate("/profile"); // Redirect back to the profile page
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating profile: " + (err.response?.data?.msg || "Server error"));
    }
  };

  if (loading) return <div>Loading profile data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
          />
          {/* Volunteer specific fields */}
          {userRole === 'volunteer' && (
            <>
              <label>Skills:</label>
              <input
                type="text"
                name="skills"
                placeholder="Comma separated skills"
                value={formData.skills || ""}
                onChange={handleChange}
              />
            </>
          )}
          {/* NGO specific fields */}
          {userRole === 'ngo' && (
            <>
              <label>Organization Name:</label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name || ""}
                onChange={handleChange}
              />
              <label>Organization Description:</label>
              <textarea
                name="organization_description"
                value={formData.organization_description || ""}
                onChange={handleChange}
              />
              <label>Website URL:</label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url || ""}
                onChange={handleChange}
              />
            </>
          )}
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;