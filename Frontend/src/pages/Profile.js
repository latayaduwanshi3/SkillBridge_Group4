import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/auth/me", {
          headers: { "x-auth-token": token },
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // The URL for the PUT request needs to include the user ID
      const res = await axios.put(
        `/api/auth/profile/${user.id}`, // ✅ Corrected URL
        user, // ✅ Send the entire user object
        { headers: { "x-auth-token": token } }
      );

      alert("Profile updated!");
      setEditMode(false);
      setUser(res.data.user);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating profile");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>My Profile</h2>

        {editMode ? (
          <div style={styles.form}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              disabled
              style={styles.input}
            />

            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              style={styles.input}
            />

            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              style={styles.input}
            />

            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              style={styles.input}
            />

            {/* Volunteer fields */}
            {user.role === "volunteer" && (
              <>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={user.location || ""}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label style={styles.label}>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={(user.skills || []).join(", ")}
                  onChange={handleChange}
                  style={styles.input}
                />
              </>
            )}

            {/* NGO fields */}
            {user.role === "ngo" && (
              <>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={user.location || ""}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label style={styles.label}>Organization Name</label>
                <input
                  type="text"
                  name="organization_name"
                  value={user.organization_name || ""}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label style={styles.label}>Organization Description</label>
                <textarea
                  name="organization_description"
                  value={user.organization_description || ""}
                  onChange={handleChange}
                  style={styles.textarea}
                ></textarea>

                <label style={styles.label}>Website URL</label>
                <input
                  type="url"
                  name="website_url"
                  value={user.website_url || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </>
            )}

            <button style={styles.button} onClick={handleSave}>
              Save
            </button>
            <button
              style={{ ...styles.button, background: "#777" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={styles.details}>
            <p>
              <b>Username:</b> {user.username}
            </p>
            <p>
              <b>Name:</b> {user.name}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
            <p>
              <b>Role:</b> {user.role}
            </p>

            {user.role === "volunteer" && (
              <>
                <p>
                  <b>Location:</b> {user.location}
                </p>
                <p>
                  <b>Skills:</b> {(user.skills || []).join(", ")}
                </p>
              </>
            )}

            {user.role === "ngo" && (
              <>
                <p>
                  <b>Location:</b> {user.location}
                </p>
                <p>
                  <b>Organization:</b> {user.organization_name}
                </p>
                <p>
                  <b>Description:</b> {user.organization_description}
                </p>
                <p>
                  <b>Website:</b> {user.website_url}
                </p>
              </>
            )}

            <button style={styles.button} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#0f111a",
  },
  container: {
    color: "white",
    width: "400px",
    padding: "25px",
    background: "#242b43",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    margin: "8px 0 5px 0",
    fontWeight: "500",
    color: "white",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "black",
  },
  textarea: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical",
  },
  button: {
    padding: "10px",
    margin: "10px 0",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },
  details: {
    textAlign: "left",
    lineHeight: "1.6",
  },
};

export default Profile;