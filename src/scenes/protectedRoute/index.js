import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Jika token tidak ada, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika role tidak sesuai, arahkan ke halaman unauthorized
  if (!userData || (allowedRoles && !allowedRoles.includes(userData.role))) {
    return <Navigate to="/unauthorized" />;
  }

  // Jika valid, render komponen yang dilindungi
  return children;
};

export default ProtectedRoute;
