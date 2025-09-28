import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchMyProfile, fetchMyMetrics } from "./api";
import type { DetailedUser, UserMetrics } from "./types";

const PROFILE_KEY = ["my-profile"] as const;
const METRICS_KEY = ["my-metrics"] as const;

export function useMyProfileQuery() {
  const { state: { session } } = useSupabaseAuth();
  const authUserId = session?.user.id ?? null;
  return useQuery<DetailedUser>({
    queryKey: [...PROFILE_KEY, authUserId],
    enabled: Boolean(authUserId),
    queryFn: () => fetchMyProfile(authUserId!),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyMetricsQuery() {
  const { state: { user } } = useSupabaseAuth();
  const tenantId = user?.tenantId ?? null;
  const userId = user?.id ?? null;
  return useQuery<UserMetrics>({
    queryKey: [...METRICS_KEY, tenantId, userId],
    enabled: Boolean(tenantId && userId),
    queryFn: () => fetchMyMetrics(tenantId!, userId!),
    staleTime: 1000 * 60 * 5,
  });
}
