import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Role } from "../components/layout/NavBar/types";


type ProtectedRouteProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  //if the user is not logged in, send them to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  //if the user is logged in but does not have the right role, send them to home page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  //you shall pass
  return <>{children}</>;
}
