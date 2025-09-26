/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { PurchaseTransaction } from "@/types/transactions";

export async function fetchPurchases(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("transaksi_pembelian")
    .select(
      "id, nomor_transaksi, tanggal, total, status, supplier_id, supplier:supplier_id ( nama )"
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(50);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorTransaksi: item.nomor_transaksi,
    tanggal: item.tanggal,
    total: item.total ?? 0,
    status: item.status,
    supplierId: item.supplier_id,
    supplierNama: (item.supplier as any)?.nama ?? "-",
  })) as PurchaseTransaction[]);
}