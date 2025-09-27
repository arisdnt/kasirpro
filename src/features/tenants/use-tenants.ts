import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenants/types";
import { fetchTenants } from "./api";

const TENANTS_KEY = ["tenants"];

export function useTenantsQuery() {
  return useQuery<Tenant[]>({
    queryKey: TENANTS_KEY,
    queryFn: () => fetchTenants(),
    staleTime: 1000 * 60,
  });
}