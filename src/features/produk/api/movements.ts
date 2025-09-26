/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { StockMovement } from "@/types/inventory";

export async function fetchProductMovements(
  tenantId: string,
  tokoId: string | null,
  produkId: string,
  limit = 30,
): Promise<StockMovement[]> {
  const client = getSupabaseClient();

  // Sales items (OUT)
  const salesQ = client
    .from("item_transaksi_penjualan")
    .select(
      `id, qty, transaksi:transaksi_id ( tanggal, nomor_transaksi, toko_id, tenant_id )`
    )
    .eq("produk_id", produkId)
    .eq("transaksi.tenant_id", tenantId)
    .order("id", { ascending: false })
    .limit(limit);
  if (tokoId) salesQ.eq("transaksi.toko_id", tokoId);

  // Purchase items (IN)
  const purchaseQ = client
    .from("item_transaksi_pembelian")
    .select(
      `id, qty, transaksi:transaksi_id ( tanggal, nomor_transaksi, toko_id, tenant_id )`
    )
    .eq("produk_id", produkId)
    .eq("transaksi.tenant_id", tenantId)
    .order("id", { ascending: false })
    .limit(limit);
  if (tokoId) purchaseQ.eq("transaksi.toko_id", tokoId);

  // Stock Opname items (ADJ)
  const opnameQ = client
    .from("stock_opname_items")
    .select(
      `id, selisih, keterangan, stock_opname:stock_opname_id ( tanggal, nomor_opname, toko_id, tenant_id )`
    )
    .eq("produk_id", produkId)
    .eq("stock_opname.tenant_id", tenantId)
    .order("id", { ascending: false })
    .limit(limit);
  if (tokoId) opnameQ.eq("stock_opname.toko_id", tokoId);

  const [salesRes, purchaseRes, opnameRes] = await Promise.all([
    salesQ, purchaseQ, opnameQ,
  ]);

  const salesMovements: StockMovement[] = ((salesRes.data as any[]) ?? []).map((row) => ({
    id: `S-${row.id}`,
    date: (row.transaksi as any)?.tanggal ?? new Date().toISOString(),
    referenceNo: (row.transaksi as any)?.nomor_transaksi ?? null,
    source: "Penjualan",
    type: "OUT",
    qtyChange: -Math.abs(Number(row.qty ?? 0)),
    note: null,
  }));

  const purchaseMovements: StockMovement[] = ((purchaseRes.data as any[]) ?? []).map((row) => ({
    id: `P-${row.id}`,
    date: (row.transaksi as any)?.tanggal ?? new Date().toISOString(),
    referenceNo: (row.transaksi as any)?.nomor_transaksi ?? null,
    source: "Pembelian",
    type: "IN",
    qtyChange: Math.abs(Number(row.qty ?? 0)),
    note: null,
  }));

  const opnameMovements: StockMovement[] = ((opnameRes.data as any[]) ?? []).map((row) => ({
    id: `O-${row.id}`,
    date: (row.stock_opname as any)?.tanggal ?? new Date().toISOString(),
    referenceNo: (row.stock_opname as any)?.nomor_opname ?? null,
    source: "Stock Opname",
    type: "ADJ",
    qtyChange: Number(row.selisih ?? 0),
    note: row.keterangan ?? null,
  }));

  const merged = [...salesMovements, ...purchaseMovements, ...opnameMovements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return merged;
}
