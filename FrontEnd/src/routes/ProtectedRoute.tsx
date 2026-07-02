import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function ProtectedRoute() {
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Outlet />;
}
