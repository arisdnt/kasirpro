import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import {
  fetchMy30dActivitySeries,
  fetchMyRecentPurchaseReturns,
  fetchMyRecentPurchases,
  fetchMyRecentSales,
  fetchMyRecentSalesReturns,
} from "./performance-api";
import type {
  ActivitySeriesPoint,
  MyPurchaseReturnRow,
  MyPurchaseRow,
  MySaleRow,
  MySalesReturnRow,
} from "./performance-types";

export function useMyRecentSales(limit = 25) {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<MySaleRow[]>({
    queryKey: ["my-sales", user?.tenantId, user?.tokoId, user?.id, limit],
    enabled: Boolean(user?.tenantId && user?.id),
    queryFn: () => fetchMyRecentSales({ tenantId: user!.tenantId!, tokoId: user!.tokoId ?? null, penggunaId: user!.id!, limit }),
    staleTime: 60_000,
  });
}

export function useMyRecentPurchases(limit = 25) {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<MyPurchaseRow[]>({
    queryKey: ["my-purchases", user?.tenantId, user?.tokoId, user?.id, limit],
    enabled: Boolean(user?.tenantId && user?.id),
    queryFn: () => fetchMyRecentPurchases({ tenantId: user!.tenantId!, tokoId: user!.tokoId ?? null, penggunaId: user!.id!, limit }),
    staleTime: 60_000,
  });
}

export function useMyRecentSalesReturns(limit = 25) {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<MySalesReturnRow[]>({
    queryKey: ["my-sales-returns", user?.tenantId, user?.tokoId, user?.id, limit],
    enabled: Boolean(user?.tenantId && user?.id),
    queryFn: () => fetchMyRecentSalesReturns({ tenantId: user!.tenantId!, tokoId: user!.tokoId ?? null, penggunaId: user!.id!, limit }),
    staleTime: 60_000,
  });
}

export function useMyRecentPurchaseReturns(limit = 25) {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<MyPurchaseReturnRow[]>({
    queryKey: ["my-purchase-returns", user?.tenantId, user?.tokoId, user?.id, limit],
    enabled: Boolean(user?.tenantId && user?.id),
    queryFn: () => fetchMyRecentPurchaseReturns({ tenantId: user!.tenantId!, tokoId: user!.tokoId ?? null, penggunaId: user!.id!, limit }),
    staleTime: 60_000,
  });
}

export function useMy30dActivitySeries() {
  const { state: { user } } = useSupabaseAuth();
  return useQuery<ActivitySeriesPoint[]>({
    queryKey: ["my-activity-30d", user?.tenantId, user?.tokoId, user?.id],
    enabled: Boolean(user?.tenantId && user?.id),
    queryFn: () => fetchMy30dActivitySeries({ tenantId: user!.tenantId!, tokoId: user!.tokoId ?? null, penggunaId: user!.id! }),
    staleTime: 60_000,
  });
}
