import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Assuming Auth.css styles are in App.css

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    duration: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Split skills string into an array before sending
      const skillsArray = formData.required_skills.split(",").map(skill => skill.trim());
      
      const opportunityData = {
        ...formData,
        required_skills: skillsArray,
      };

      await axios.post(
        "/api/opportunities/create",
        opportunityData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      
      alert("Opportunity created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating opportunity: " + (err.response?.data?.msg || "Server error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create New Opportunity</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Opportunity Title"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description of the opportunity"
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="required_skills"
            placeholder="Required Skills (comma separated)"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 3 weeks, Ongoing)"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />
          <button type="submit">Create Opportunity</button>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;