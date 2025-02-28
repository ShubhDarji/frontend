import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUser(res.data || {});
    } catch (err) {
      setMessage("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
  
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const formData = new FormData();
  
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
  
    // Append all additional fields
    formData.append("name", user.name);
    formData.append("phone", user.phone || "");
    formData.append("dob", user.dob || "");
    formData.append("gender", user.gender || "");
    formData.append("address", user.address || "");
  
    console.log("Updating profile with data:", Object.fromEntries(formData)); // Debugging
  
    try {
      const { data } = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      setMessage("Profile updated successfully!");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      setMessage("Failed to update profile. Try again.");
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div className="profile-card">
          <h2>Your Profile</h2>
          <p>{message}</p>
          <form onSubmit={updateProfile}>
            <div className="form-group">
              {user.profilePicture ? (
                <>
                  <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt="Profile"
                    className="profile-image"
                  />
                  <button type="button" className="change-picture-btn">
                    Change Profile Picture
                  </button>
                </>
              ) : (
                <button type="button" className="add-picture-btn">
                  Add Profile Picture
                </button>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={user.email} disabled />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={user.dob || ""}
                onChange={(e) => setUser({ ...user, dob: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={user.gender || ""}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              ></textarea>
            </div>

            <button className="btn" type="submit">
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <p>Error loading profile. Please try again.</p>
      )}
    </div>
  );
};

export default Profile;
