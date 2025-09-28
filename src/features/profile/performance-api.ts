/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  ActivitySeriesPoint,
  MyPurchaseReturnRow,
  MyPurchaseRow,
  MySaleRow,
  MySalesReturnRow,
} from "./performance-types";

function toMidnight(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function fmtYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function fetchMyRecentSales(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  limit?: number;
}): Promise<MySaleRow[]> {
  const client = getSupabaseClient();
  const limit = params.limit ?? 25;
  let query = client
    .from("transaksi_penjualan")
    .select(
      `id, nomor_transaksi, tanggal, total, metode_pembayaran,
       pelanggan_id, pelanggan:pelanggan_id ( nama )`
    )
    .eq("tenant_id", params.tenantId)
    .eq("pengguna_id", params.penggunaId)
    .order("tanggal", { ascending: false })
    .limit(limit);

  if (params.tokoId) query = query.eq("toko_id", params.tokoId);

  const { data, error } = await query;
  if (error) throw error;
  return ((data as any[]) ?? []).map((r) => ({
    id: r.id,
    nomor: r.nomor_transaksi,
    tanggal: r.tanggal,
    total: r.total ?? 0,
    pelangganNama: (r.pelanggan as any)?.nama ?? null,
    metodePembayaran: r.metode_pembayaran ?? null,
  }));
}

export async function fetchMyRecentPurchases(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  limit?: number;
}): Promise<MyPurchaseRow[]> {
  const client = getSupabaseClient();
  const limit = params.limit ?? 25;
  let query = client
    .from("transaksi_pembelian")
    .select(`id, nomor_transaksi, tanggal, total, status, supplier_id, supplier:supplier_id ( nama )`)
    .eq("tenant_id", params.tenantId)
    .eq("pengguna_id", params.penggunaId)
    .order("tanggal", { ascending: false })
    .limit(limit);
  if (params.tokoId) query = query.eq("toko_id", params.tokoId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data as any[]) ?? []).map((r) => ({
    id: r.id,
    nomor: r.nomor_transaksi,
    tanggal: r.tanggal,
    total: r.total ?? 0,
    status: r.status ?? null,
    supplierNama: (r.supplier as any)?.nama ?? null,
  }));
}

export async function fetchMyRecentSalesReturns(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  limit?: number;
}): Promise<MySalesReturnRow[]> {
  const client = getSupabaseClient();
  const limit = params.limit ?? 25;
  let query = client
    .from("retur_penjualan")
    .select(`id, nomor_retur, tanggal, total, status, pelanggan_id, pelanggan:pelanggan_id ( nama )`)
    .eq("tenant_id", params.tenantId)
    .eq("pengguna_id", params.penggunaId)
    .order("tanggal", { ascending: false })
    .limit(limit);
  if (params.tokoId) query = query.eq("toko_id", params.tokoId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data as any[]) ?? []).map((r) => ({
    id: r.id,
    nomor: r.nomor_retur,
    tanggal: r.tanggal,
    total: r.total ?? 0,
    status: r.status ?? null,
    pelangganNama: (r.pelanggan as any)?.nama ?? null,
  }));
}

export async function fetchMyRecentPurchaseReturns(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  limit?: number;
}): Promise<MyPurchaseReturnRow[]> {
  const client = getSupabaseClient();
  const limit = params.limit ?? 25;
  let query = client
    .from("retur_pembelian")
    .select(`id, nomor_retur, tanggal, total, status, supplier_id, supplier:supplier_id ( nama )`)
    .eq("tenant_id", params.tenantId)
    .eq("pengguna_id", params.penggunaId)
    .order("tanggal", { ascending: false })
    .limit(limit);
  if (params.tokoId) query = query.eq("toko_id", params.tokoId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data as any[]) ?? []).map((r) => ({
    id: r.id,
    nomor: r.nomor_retur,
    tanggal: r.tanggal,
    total: r.total ?? 0,
    status: r.status ?? null,
    supplierNama: (r.supplier as any)?.nama ?? null,
  }));
}

export async function fetchMy30dActivitySeries(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
}): Promise<ActivitySeriesPoint[]> {
  const client = getSupabaseClient();
  const end = toMidnight(new Date());
  const start = new Date(end);
  start.setDate(end.getDate() - 29);
  const since = start.toISOString();

  // Query all four tables since 'since'
  const [sales, purchases, salesReturns, purchaseReturns] = await Promise.all([
    (async () => {
      let q = client
        .from("transaksi_penjualan")
        .select("tanggal, total")
        .eq("tenant_id", params.tenantId)
        .eq("pengguna_id", params.penggunaId)
        .gte("tanggal", since);
      if (params.tokoId) q = q.eq("toko_id", params.tokoId);
      const r = await q;
      if (r.error) throw r.error;
      return (r.data as any[]) ?? [];
    })(),
    (async () => {
      let q = client
        .from("transaksi_pembelian")
        .select("tanggal, total")
        .eq("tenant_id", params.tenantId)
        .eq("pengguna_id", params.penggunaId)
        .gte("tanggal", since);
      if (params.tokoId) q = q.eq("toko_id", params.tokoId);
      const r = await q;
      if (r.error) throw r.error;
      return (r.data as any[]) ?? [];
    })(),
    (async () => {
      let q = client
        .from("retur_penjualan")
        .select("tanggal, total")
        .eq("tenant_id", params.tenantId)
        .eq("pengguna_id", params.penggunaId)
        .gte("tanggal", since);
      if (params.tokoId) q = q.eq("toko_id", params.tokoId);
      const r = await q;
      if (r.error) throw r.error;
      return (r.data as any[]) ?? [];
    })(),
    (async () => {
      let q = client
        .from("retur_pembelian")
        .select("tanggal, total")
        .eq("tenant_id", params.tenantId)
        .eq("pengguna_id", params.penggunaId)
        .gte("tanggal", since);
      if (params.tokoId) q = q.eq("toko_id", params.tokoId);
      const r = await q;
      if (r.error) throw r.error;
      return (r.data as any[]) ?? [];
    })(),
  ]);

  const byDay: Record<string, ActivitySeriesPoint> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = fmtYMD(d);
    byDay[key] = {
      date: key,
      salesTotal: 0,
      salesCount: 0,
      purchaseTotal: 0,
      purchaseCount: 0,
      salesReturnTotal: 0,
      purchaseReturnTotal: 0,
    };
  }

  const add = (arr: any[], kind: "sale" | "purchase" | "salesReturn" | "purchaseReturn") => {
    for (const row of arr) {
      const d = new Date(row.tanggal ?? row.created_at ?? row.updated_at ?? Date.now());
      const key = fmtYMD(toMidnight(d));
      const p = byDay[key];
      if (!p) continue;
      const amount = Number(row.total) || 0;
      if (kind === "sale") {
        p.salesTotal += amount;
        p.salesCount += 1;
      } else if (kind === "purchase") {
        p.purchaseTotal += amount;
        p.purchaseCount += 1;
      } else if (kind === "salesReturn") {
        p.salesReturnTotal += amount;
      } else if (kind === "purchaseReturn") {
        p.purchaseReturnTotal += amount;
      }
    }
  };

  add(sales, "sale");
  add(purchases, "purchase");
  add(salesReturns, "salesReturn");
  add(purchaseReturns, "purchaseReturn");

  return Object.values(byDay);
}
