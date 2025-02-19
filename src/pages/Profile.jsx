import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    deliveryInstructions: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj?._id) {
        setUser(userObj);
        setFormData({
          name: userObj.name || "",
          email: userObj.email || "",
          phone: userObj.phone || "",
          address: userObj.address || "",
          city: userObj.city || "",
          state: userObj.state || "",
          zip: userObj.zip || "",
          country: userObj.country || "",
          deliveryInstructions: userObj.deliveryInstructions || "",
        });
        fetchUserProfile(userObj._id);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.profileImage) {
        setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      }
    } catch (err) {
      console.error("Error fetching profile image:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-card">
          <h2>Your Profile</h2>

          <div className="profile-picture-section">
            {user.profileImage ? (
              <img
                src={`http://localhost:5000/uploads/${user.profileImage}`}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="no-image">Profile Picture</div>
            )}
            <button className="upload-button">Upload Picture</button>
          </div>

          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code:</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select a country</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Instructions:</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleChange}
                placeholder="Any special instructions for delivery (optional)"
              />
            </div>

            <button type="button" onClick={updateProfile}>
              Update Profile
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
