import React, { useState } from "react";
import axios from "axios";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/seller/login", {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" } // ✅ Ensure JSON content
      });

      console.log("✅ Login Response:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("seller", JSON.stringify(res.data.seller));

      setMessage("Login successful!");
      window.location.href = "/seller-dashboard"; // Redirect to dashboard
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div>
      <h2>Seller Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SellerLogin;
