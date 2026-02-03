import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // ❌ Not logged in
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Logged in
  return children;
}
