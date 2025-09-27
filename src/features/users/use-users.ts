import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { ManagementUser } from "@/features/users/types";
import { fetchUsers } from "./api";

const USERS_KEY = ["users"];

export function useUsersQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<ManagementUser[]>({
    queryKey: [...USERS_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchUsers(user!.tenantId),
    staleTime: 1000 * 60,
  });
}