import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    duration: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        const opp = res.data;
        setFormData({
          title: opp.title,
          description: opp.description,
          required_skills: opp.required_skills.join(", "),
          duration: opp.duration,
          location: opp.location,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch opportunity data.");
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const skillsArray = formData.required_skills.split(",").map(skill => skill.trim());
      
      const opportunityData = {
        ...formData,
        required_skills: skillsArray,
      };

      await axios.put(
        `/api/opportunities/${id}/edit`,
        opportunityData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      
      alert("Opportunity updated successfully!");
      navigate("/opportunities");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating opportunity: " + (err.response?.data?.msg || "Server error"));
    }
  };

  if (loading) return <div>Loading opportunity...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Edit Opportunity</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Opportunity Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description of the opportunity"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="required_skills"
            placeholder="Required Skills (comma separated)"
            value={formData.required_skills}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 3 weeks, Ongoing)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditOpportunity;