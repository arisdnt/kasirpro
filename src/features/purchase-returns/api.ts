/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { PurchaseReturnTransaction } from "@/types/transactions";

export async function fetchPurchaseReturns(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  let query = client
    .from("retur_pembelian")
    .select(`
      id,
      nomor_retur,
      tanggal,
      total,
      status,
      supplier_id,
      supplier:supplier!inner(nama),
      alasan,
      created_at,
      updated_at
    `)
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false });

  if (tokoId) {
    query = query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorRetur: item.nomor_retur,
    tanggal: item.tanggal,
    total: item.total,
    status: item.status,
    supplierId: item.supplier_id,
    supplierNama: item.supplier?.nama ?? "Unknown",
    alasan: item.alasan,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as PurchaseReturnTransaction[]);
}