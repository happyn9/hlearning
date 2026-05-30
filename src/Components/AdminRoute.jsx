import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";


export function AdminRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}