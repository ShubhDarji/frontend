import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect non-admin users
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ✅ Fetch Users Function
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("📡 Fetching all users");

      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.error("❌ Fetch users error:", error.response?.data);
      setMessage("Error fetching users");
    }
  };

  // ✅ Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Approve Seller
  const approveSeller = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("📡 Sending approval request for seller:", userId);

      await axios.put(`http://localhost:5000/api/admin/approve-seller/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isApproved: true } : user
        )
      );
      setMessage("Seller approved successfully!");
    } catch (error) {
      console.error("❌ Approval error:", error.response?.data);
      setMessage("Failed to approve seller");
    }
  };

  // ✅ Delete User
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
      setMessage("User deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete user");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.role === "seller" ? (user.isApproved ? "Approved" : "Pending") : "N/A"}</td>
              <td>
                {user.role === "seller" && !user.isApproved && (
                  <button onClick={() => approveSeller(user._id)} className="approve-btn">Approve</button>
                )}
                <button onClick={() => deleteUser(user._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
