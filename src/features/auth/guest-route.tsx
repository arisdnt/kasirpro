import { Navigate, Outlet } from "react-router-dom";
import { useSupabaseAuth } from "./supabase-auth-provider";

export function GuestRoute() {
  const {
    state: { isLoading, user },
  } = useSupabaseAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
