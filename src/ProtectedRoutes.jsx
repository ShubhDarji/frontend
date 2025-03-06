import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  // Check stored tokens based on role
  const userToken = localStorage.getItem("userToken");
  const sellerToken = localStorage.getItem("sellerToken");
  const adminToken = localStorage.getItem("adminToken");

  // Role-based access control
  if (role === "user" && !userToken) return <Navigate to="/login" />;
  if (role === "seller" && !sellerToken) return <Navigate to="/seller-login" />;
  if (role === "admin" && !adminToken) return <Navigate to="/admin-login" />;

  return <Outlet />;
};

export default ProtectedRoute;
