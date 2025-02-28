import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SellerRegistration.css"; // Add CSS for styling

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    gstNumber: "",
    address: "",
    proof: null,
  });

  const [step, setStep] = useState(1); // Multi-step form
  const [message, setMessage] = useState("");
  const [previewURL, setPreviewURL] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // Address suggestions
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing user data to pre-fill fields
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ 
          name: res.data.name || "", 
          email: res.data.email || "", 
          phone: res.data.phone || "" 
        });
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  // ✅ Handle field changes
  const handleChange = (e) => {
    if (e.target.name === "proof") {
      const file = e.target.files[0];
      setFormData({ ...formData, proof: file });

      // File preview
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Handle Address Auto-Fill Using OpenStreetMap Nominatim API
  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    if (value.length > 2) {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error fetching address suggestions", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectAddress = (address) => {
    setFormData({ ...formData, address });
    setSuggestions([]); // Clear suggestions after selection
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/sellers/register", form, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      navigate("/seller-dashboard"); // Redirect after successful submission
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="seller-registration-container">
      <h2>Become a Seller</h2>
      {message && <p>{message}</p>}

      {/* Multi-Step Form */}
      {step === 1 && (
        <div>
          <h3>Step 1: Personal Information</h3>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} disabled />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} disabled />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} required onChange={handleChange} />
          </div>
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Step 2: Business Details</h3>
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" name="businessName" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>GST / Business License Number</label>
            <input type="text" name="gstNumber" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Business Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter business address..."
              value={formData.address}
              onChange={handleAddressChange}
            />
            {/* Show address suggestions */}
            {suggestions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {suggestions.map((place, index) => (
                  <li key={index} onClick={() => selectAddress(place.display_name)}>
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Step 3: Upload Documents</h3>
          <div className="form-group">
            <label>Upload Proof of Business (PDF, JPG, PNG)</label>
            <input type="file" name="proof" accept=".pdf,.jpg,.png" required onChange={handleChange} />
            {previewURL && <img src={previewURL} alt="Preview" className="file-preview" />}
          </div>
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default SellerRegistration;
