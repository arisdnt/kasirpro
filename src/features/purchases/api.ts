/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { PurchaseTransaction, PurchaseItem } from "@/features/purchases/types";

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

export async function fetchPurchaseItems(transaksiId: string) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("item_transaksi_pembelian")
    .select(
      `id,
       transaksi_id,
       produk_id,
       qty,
       harga_satuan,
       subtotal,
       produk:produk_id ( nama, kode, kategori_id, kategori:kategori_id ( nama ) )`
    )
    .eq("transaksi_id", transaksiId)
    .order("id", { ascending: true });

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    transaksiId: item.transaksi_id,
    produkId: item.produk_id,
    produkNama: (item.produk as any)?.nama ?? "Produk tidak diketahui",
    produkKode: (item.produk as any)?.kode ?? null,
    kategoriNama: (item.produk as any)?.kategori?.nama ?? null,
    qty: item.qty ?? 0,
    hargaSatuan: item.harga_satuan ?? 0,
    subtotal: item.subtotal ?? 0,
  })) as PurchaseItem[]);
}