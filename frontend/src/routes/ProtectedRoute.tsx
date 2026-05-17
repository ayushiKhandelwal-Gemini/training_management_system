import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const RoleProtectedRoute = ({ roles }: { roles: UserRole[] }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    const destination = user?.role === "TRAINER" ? "/trainer/dashboard" : "/student/dashboard";
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};
