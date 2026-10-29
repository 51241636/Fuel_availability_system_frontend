
import { Navigate } from "react-router-dom";

import { use, type ReactNode } from "react";
import { useAuth } from "../context/AuthConext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  console.log("user0202", user)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User does not have the required role
  if (allowedRoles && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allow access
  return <>{children}</>;
}

export default ProtectedRoute;
