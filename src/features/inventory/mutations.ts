import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

export type InventarisInput = {
  produkId: string;
  stockFisik?: number | null;
  stockTersedia?: number | null;
  stockMinimum?: number | null;
  stockMaksimum?: number | null;
  lokasiRak?: string | null;
  batchNumber?: string | null;
  tanggalExpired?: string | null; // ISO date string (YYYY-MM-DD)
};

export function useCreateInventaris() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InventarisInput) => {
      if (!user?.tenantId || !user?.tokoId) {
        throw new Error("Tenant dan Toko harus dipilih untuk membuat inventaris");
      }
      const client = getSupabaseClient();
      const insert = {
        tenant_id: user.tenantId,
        toko_id: user.tokoId,
        produk_id: input.produkId,
        stock_fisik: input.stockFisik ?? null,
        stock_tersedia: input.stockTersedia ?? null,
        stock_minimum: input.stockMinimum ?? null,
        stock_maksimum: input.stockMaksimum ?? null,
        lokasi_rak: input.lokasiRak ?? null,
        batch_number: input.batchNumber ?? null,
        tanggal_expired: input.tanggalExpired ?? null,
      } as Record<string, unknown>;
      const { data, error } = await client
        .from("inventaris")
        .insert(insert as never)
        .select("id")
        .single();
      if (error) throw error;
      return (data as { id: string }).id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-batch"] });
    },
  });
}

export function useUpdateInventaris() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string } & InventarisInput) => {
      const { id, ...input } = params;
      const client = getSupabaseClient();
      const patch: Record<string, unknown> = {
        produk_id: input.produkId,
        stock_fisik: input.stockFisik ?? null,
        stock_tersedia: input.stockTersedia ?? null,
        stock_minimum: input.stockMinimum ?? null,
        stock_maksimum: input.stockMaksimum ?? null,
        lokasi_rak: input.lokasiRak ?? null,
        batch_number: input.batchNumber ?? null,
        tanggal_expired: input.tanggalExpired ?? null,
      };
      const { error } = await client
        .from("inventaris")
        .update(patch as never)
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-batch"] });
    },
  });
}

export function useDeleteInventaris() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const client = getSupabaseClient();
      const { error } = await client
        .from("inventaris")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-batch"] });
    },
  });
}
