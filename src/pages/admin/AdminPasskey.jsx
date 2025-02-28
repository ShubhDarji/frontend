import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPasskey = () => {
  const [passkey, setPasskey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passkey === "7743") {
      navigate("/admin-signup"); // ✅ Allow access if passkey is correct
    } else {
      navigate("/"); // ❌ Redirect to home if incorrect
    }
  };

  return (
    <div>
      <h2>Admin Access</h2>
      <p>Enter the secret passkey to continue:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminPasskey;
