import {
  Navigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({
  children,
  role
}) {

  const { user } = useAuth();

  const location = useLocation();

  if (!user) {

    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname
        }}
        replace
      />
    );
  }

  if (
    role &&
    user.role !== role
  ) {

    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;