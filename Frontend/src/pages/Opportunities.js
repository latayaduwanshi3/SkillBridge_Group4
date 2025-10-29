import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "./Opportunities.css";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setUserRole(decoded.user.role);

        if (decoded.user.role === 'ngo') {
            const res = await axios.get(`/api/opportunities/ngo`, {
                headers: { "x-auth-token": token },
            });
            setOpportunities(res.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch opportunities.");
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  if (loading) return <div className="opportunities">Loading opportunities...</div>;
  if (error) return <div className="opportunities">{error}</div>;
  
  if (userRole === 'ngo') {
    return (
      <div className="opportunities">
        <div className="opportunities-header">
          <h2>Your Opportunities</h2>
          &nbsp;&nbsp;
          <Link to="/create-opportunity" className="create-btn">Create Opportunity</Link>
        </div>
        <div className="opportunities-grid">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <div key={opportunity._id} className="opportunity-card">
                <div className="opportunity-content">
                  <h3>{opportunity.title}</h3>
                  <p className="duration">Duration: {opportunity.duration}</p>
                  <p className="duration">Location: {opportunity.location}</p>
                  <Link to={`/edit-opportunity/${opportunity._id}`}>
                    <button className="apply-btn">Edit</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>You have not created any opportunities yet.</p>
          )}
        </div>
      </div>
    );
  }

  // Content for volunteers or unauthenticated users
  return (
    <div className="opportunities">
      <div className="opportunities-header">
        <h2>Access Denied</h2>
      </div>
      <div className="opportunities-message">
        <p>This page is only for NGOs to manage their opportunities.</p>
        <p>Volunteers can find opportunities on the <Link to="/dashboard">Dashboard</Link>.</p>
      </div>
    </div>
  );
}

export default Opportunities;