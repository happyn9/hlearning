import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) return <Navigate to="/auth" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}