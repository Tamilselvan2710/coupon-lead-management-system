import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const isAdmin = localStorage.getItem("isAdmin");

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}