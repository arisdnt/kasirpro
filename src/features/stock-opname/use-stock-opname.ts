import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { createStockOpnameDraft, deleteStockOpname, fetchStockOpnameDetail, fetchStockOpnameSummaries, updateStockOpnameHeader } from "./api";
import type { StockOpnameDetail, StockOpnameSummary } from "@/features/stock-opname/types";

const LIST_KEY = ["stock-opname", "list"] as const;
const DETAIL_KEY = ["stock-opname", "detail"] as const;

export function useStockOpnameList(tokoId: string | null | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = tokoId && tokoId !== "all" ? tokoId : user?.tokoId ?? null;

  return useQuery<StockOpnameSummary[]>({
    queryKey: [...LIST_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchStockOpnameSummaries(user!.tenantId, effectiveStore),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
}

export function useStockOpnameDetail(opnameId: string | null) {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<StockOpnameDetail | null>({
    queryKey: [...DETAIL_KEY, user?.tenantId, opnameId],
    enabled: Boolean(user?.tenantId) && Boolean(opnameId),
    queryFn: () => fetchStockOpnameDetail(opnameId!),
  });
}

export function useCreateStockOpname() {
  const client = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (payload: { tokoId?: string; tanggal?: string; catatan?: string | null }) => {
      if (!user) throw new Error("User belum siap");
      const tokoId = payload.tokoId ?? user.tokoId;
      if (!tokoId) throw new Error("Toko aktif belum dipilih");
      return createStockOpnameDraft({
        tenantId: user.tenantId,
        tokoId,
        penggunaId: user.id,
        tanggal: payload.tanggal,
        catatan: payload.catatan ?? null,
      });
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["stock-opname", "list"] });
    },
  });
}

export function useUpdateStockOpname() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateStockOpnameHeader,
    onSuccess: (_data, vars) => {
      void client.invalidateQueries({ queryKey: ["stock-opname", "list"] });
      if (vars.id) {
        void client.invalidateQueries({ queryKey: ["stock-opname", "detail"] });
      }
    },
  });
}

export function useDeleteStockOpname() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteStockOpname(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["stock-opname", "list"] });
      void client.invalidateQueries({ queryKey: ["stock-opname", "detail"] });
    },
  });
}
