import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

interface RoleRouteProps {
  allow: Array<"admin" | "customer">;
}

export default function RoleRoute({ allow }: RoleRouteProps) {
  const { role, initialized } = useAuth();

  if (!initialized) {
    return <Loader size="lg" label="Loading..." />;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return <Outlet />;
}
