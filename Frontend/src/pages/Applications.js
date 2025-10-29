import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setUserRole(decoded.user.role);

        let res;
        if (decoded.user.role === "ngo") {
          res = await axios.get(
            "/api/opportunities/applications/ngo",
            {
              headers: { "x-auth-token": token },
            }
          );
        } else {
          res = await axios.get(
            "/api/opportunities/applications/me",
            {
              headers: { "x-auth-token": token },
            }
          );
        }

        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch applications.");
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/opportunities/applications/${appId}/status`,
        { status: newStatus },
        { headers: { "x-auth-token": token } }
      );

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating application status.");
    }
  };

  if (loading)
    return <div className="applications-page">Loading applications...</div>;
  if (error) return <div className="applications-page">{error}</div>;

  // --- Count summary ---
  const acceptedCount = applications.filter(
    (app) => app.status === "accepted"
  ).length;
  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  // NGO View
  if (userRole === "ngo") {
    return (
      <div className="applications-page">
        <div className="applications-header">
          <h2>Manage Applicants</h2>
        </div>

        {/* Summary Boxes */}
        <div className="applications-summary">
          <div className="summary-box accepted">
            <h3>Accepted</h3>
            <p>{acceptedCount}</p>
          </div>
          <div className="summary-box pending">
            <h3>Pending</h3>
            <p>{pendingCount}</p>
          </div>
          <div className="summary-box rejected">
            <h3>Rejected</h3>
            <p>{rejectedCount}</p>
          </div>
        </div>

        <div className="applications-grid">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="application-card">
                <h3>Applicant: {app.volunteerId?.name || "N/A"}</h3>
                <p className="org">
                  Applied for: {app.opportunityId?.title || "N/A"}
                </p>
                <p className="date">
                  Email: {app.volunteerId?.email || "N/A"}
                </p>
                <div className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </div>
                <div className="action-buttons">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(app._id, "accepted")
                        }
                        className="action-btn accept-btn"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(app._id, "rejected")
                        }
                        className="action-btn reject-btn"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No new applications for your opportunities.</p>
          )}
        </div>
      </div>
    );
  }

  // Volunteer View
  return (
    <div className="applications-page">
      <div className="applications-header">
        <h2>My Applications</h2>
      </div>

      {/* Summary Boxes */}
      <div className="applications-summary">
        <div className="summary-box accepted">
          <h3>Accepted</h3>
          <p>{acceptedCount}</p>
        </div>
        <div className="summary-box pending">
          <h3>Pending</h3>
          <p>{pendingCount}</p>
        </div>
        <div className="summary-box rejected">
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>
      </div>

      <div className="applications-grid">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="application-card">
              <h3>{app.opportunityId?.title || "N/A"}</h3>
              <p className="org">
                Posted by:{" "}
                {app.opportunityId?.ngo_id?.organization_name || "N/A"}
              </p>
              <p className="date">
                Applied on: {new Date(app.createdAt).toLocaleDateString()}
              </p>
              <div className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </div>
            </div>
          ))
        ) : (
          <p>You have not applied for any opportunities yet.</p>
        )}
      </div>
    </div>
  );
}

export default Applications;
