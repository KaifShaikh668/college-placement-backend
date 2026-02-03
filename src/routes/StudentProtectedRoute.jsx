import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("studentToken");

  if (!token) {
    // ❌ Not logged in
    return <Navigate to="/login/student" replace />;
  }

  // ✅ Logged in
  return children;
}
