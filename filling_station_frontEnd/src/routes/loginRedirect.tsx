import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthConext";
import Login from "../pages/login";

const LoginRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (user) {
    switch (user.userRole) {
      case "owner":
        return <Navigate to="/dashboard" replace />;

      case "customer":
        return <Navigate to="/customerMapView" replace />;

      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Login />;
};

export default LoginRedirect;
