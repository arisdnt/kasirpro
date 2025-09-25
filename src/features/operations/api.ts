/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  PurchaseTransaction,
  ReturnTransaction,
  InternalMessage,
  AuditEntry,
} from "@/types/transactions";

export async function fetchPurchases(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("transaksi_pembelian")
    .select(
      "id, nomor_transaksi, tanggal, total, status, supplier:supplier_id ( nama )"
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(6);

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
    supplierId: "",
    supplierNama: (item.supplier as any)?.nama ?? "-",
  })) as PurchaseTransaction[]);
}

export async function fetchSalesReturns(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("retur_penjualan")
    .select(
      "id, nomor_retur, tanggal, total, status, pelanggan:pelanggan_id ( nama )"
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(6);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorRetur: item.nomor_retur,
    tanggal: item.tanggal,
    total: item.total ?? 0,
    status: item.status,
    pelangganNama: (item.pelanggan as any)?.nama ?? null,
  })) as ReturnTransaction[]);
}

export async function fetchInternalMessages(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("perpesanan")
    .select("id, judul, isi, status, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (tokoId) {
    query.eq("toko_target_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    judul: item.judul,
    isi: item.isi,
    status: item.status,
    createdAt: item.created_at,
  })) as InternalMessage[]);
}

export async function fetchAuditLogs(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("audit_log")
    .select("id, tabel, aksi, user_id, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    tabel: item.tabel,
    aksi: item.aksi,
    userId: item.user_id,
    createdAt: item.created_at,
  })) as AuditEntry[]);
}
