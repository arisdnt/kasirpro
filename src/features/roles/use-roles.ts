import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { ManagementRole } from "@/features/auth/types";
import { fetchRoles } from "./api";

const ROLES_KEY = ["roles"];

export function useRolesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<ManagementRole[]>({
    queryKey: [...ROLES_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchRoles(user!.tenantId),
    staleTime: 1000 * 60,
  });
}