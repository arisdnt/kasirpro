/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { Supplier } from "@/types/partners";

export async function fetchSuppliers(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("supplier")
    .select("id, kode, nama, kontak_person, telepon, email, status, kota, provinsi, alamat, kode_pos, npwp, tempo_pembayaran, limit_kredit, toko_id, created_at, updated_at")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (
    ((data as any[]) ?? []).map((item: any) => ({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      kontakPerson: item.kontak_person,
      telepon: item.telepon,
      email: item.email,
      status: item.status,
      kota: item.kota,
      provinsi: item.provinsi,
      alamat: item.alamat ?? null,
      kodePos: item.kode_pos ?? null,
      npwp: item.npwp ?? null,
      tempoPembayaran: item.tempo_pembayaran ?? null,
      limitKredit: item.limit_kredit ? Number(item.limit_kredit) : null,
      tokoId: item.toko_id ?? null,
      createdAt: item.created_at ?? null,
      updatedAt: item.updated_at ?? null,
    })) ?? []
  ) satisfies Supplier[];
}

export async function createSupplier(params: {
  tenantId: string;
  tokoId: string | null;
  payload: {
    kode: string;
    nama: string;
    kontakPerson?: string | null;
    telepon?: string | null;
    email?: string | null;
    status?: "aktif" | "nonaktif";
    alamat?: string | null;
    kota?: string | null;
    provinsi?: string | null;
    kodePos?: string | null;
    npwp?: string | null;
    tempoPembayaran?: number | null;
    limitKredit?: number | null;
  };
}) {
  const client = getSupabaseClient();
  const insert = {
    tenant_id: params.tenantId,
    toko_id: params.tokoId,
    kode: params.payload.kode,
    nama: params.payload.nama,
    kontak_person: params.payload.kontakPerson ?? null,
    telepon: params.payload.telepon ?? null,
    email: params.payload.email ?? null,
    status: params.payload.status ?? "aktif",
    alamat: params.payload.alamat ?? null,
    kota: params.payload.kota ?? null,
    provinsi: params.payload.provinsi ?? null,
    kode_pos: params.payload.kodePos ?? null,
    npwp: params.payload.npwp ?? null,
    tempo_pembayaran: params.payload.tempoPembayaran ?? 30,
    limit_kredit: params.payload.limitKredit ?? 0,
  } as Record<string, unknown>;

  const { data, error } = await client
    .from("supplier")
    .insert(insert as never)
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

export async function updateSupplier(params: {
  id: string;
  payload: Partial<{
    kode: string;
    nama: string;
    kontakPerson: string | null;
    telepon: string | null;
    email: string | null;
    status: "aktif" | "nonaktif";
    alamat: string | null;
    kota: string | null;
    provinsi: string | null;
    kodePos: string | null;
    npwp: string | null;
    tempoPembayaran: number | null;
    limitKredit: number | null;
  }>;
}) {
  const client = getSupabaseClient();
  const patch: Record<string, unknown> = {};
  const p = params.payload;
  if (p.kode !== undefined) patch.kode = p.kode;
  if (p.nama !== undefined) patch.nama = p.nama;
  if (p.kontakPerson !== undefined) patch.kontak_person = p.kontakPerson;
  if (p.telepon !== undefined) patch.telepon = p.telepon;
  if (p.email !== undefined) patch.email = p.email;
  if (p.status !== undefined) patch.status = p.status;
  if (p.alamat !== undefined) patch.alamat = p.alamat;
  if (p.kota !== undefined) patch.kota = p.kota;
  if (p.provinsi !== undefined) patch.provinsi = p.provinsi;
  if (p.kodePos !== undefined) patch.kode_pos = p.kodePos;
  if (p.npwp !== undefined) patch.npwp = p.npwp;
  if (p.tempoPembayaran !== undefined) patch.tempo_pembayaran = p.tempoPembayaran;
  if (p.limitKredit !== undefined) patch.limit_kredit = p.limitKredit;
  if (Object.keys(patch).length === 0) return;
  const { error } = await client.from("supplier").update(patch as never).eq("id", params.id);
  if (error) throw error;
}

export async function deleteSupplier(id: string) {
  const client = getSupabaseClient();
  const { error } = await client.from("supplier").delete().eq("id", id);
  if (error) throw error;
}

export type SupplierPurchase = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
};

export async function fetchSupplierPurchases(params: { tenantId: string; tokoId: string | null; supplierId: string }) {
  const client = getSupabaseClient();
  let q = client
    .from("transaksi_pembelian")
    .select("id, nomor_transaksi, tanggal, total, status")
    .eq("tenant_id", params.tenantId)
    .eq("supplier_id", params.supplierId)
    .order("tanggal", { ascending: false })
    .limit(50);
  if (params.tokoId) q = q.eq("toko_id", params.tokoId);
  const { data, error } = await q;
  if (error) throw error;
  return (((data as any[]) ?? []).map((r) => ({
    id: r.id,
    nomorTransaksi: r.nomor_transaksi,
    tanggal: r.tanggal,
    total: Number(r.total) || 0,
    status: r.status ?? null,
  })) as SupplierPurchase[]);
}

export type SupplierProductAggregate = {
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  kategoriNama: string | null;
  totalQty: number;
  transaksiCount: number;
  lastPurchasedAt: string | null;
};

export async function fetchSupplierProducts(params: { tenantId: string; tokoId: string | null; supplierId: string }) {
  const client = getSupabaseClient();
  // First, fetch recent purchases for this supplier (ids + tanggal)
  let q = client
    .from("transaksi_pembelian")
    .select("id, tanggal")
    .eq("tenant_id", params.tenantId)
    .eq("supplier_id", params.supplierId)
    .order("tanggal", { ascending: false })
    .limit(100);
  if (params.tokoId) q = q.eq("toko_id", params.tokoId);
  const { data: txRows, error: txErr } = await q;
  if (txErr) throw txErr;
  const txs = ((txRows as any[]) ?? []).map((r) => ({ id: r.id as string, tanggal: r.tanggal as string }));
  if (txs.length === 0) return [] as SupplierProductAggregate[];
  const txDateMap = new Map<string, string>(txs.map((t) => [t.id, t.tanggal]));
  const txIds = txs.map((t) => t.id);

  // Then, fetch items for these transactions and aggregate by product
  const { data: itemRows, error: itemErr } = await client
    .from("item_transaksi_pembelian")
    .select(
      `id, transaksi_id, produk_id, qty,
       produk:produk_id ( nama, kode, kategori_id, kategori:kategori_id ( nama ) )`
    )
    .in("transaksi_id", txIds);
  if (itemErr) throw itemErr;
  const aggregates = new Map<string, SupplierProductAggregate>();
  for (const row of ((itemRows as any[]) ?? [])) {
    const pid = row.produk_id as string;
    const existed = aggregates.get(pid);
    const tanggal = txDateMap.get(row.transaksi_id as string) ?? null;
    const produk = row.produk as any;
    const base: SupplierProductAggregate = existed ?? {
      produkId: pid,
      produkNama: produk?.nama ?? "Produk",
      produkKode: produk?.kode ?? null,
      kategoriNama: produk?.kategori?.nama ?? null,
      totalQty: 0,
      transaksiCount: 0,
      lastPurchasedAt: null,
    };
    base.totalQty += Number(row.qty) || 0;
    base.transaksiCount += 1;
    if (!base.lastPurchasedAt || (tanggal && new Date(tanggal) > new Date(base.lastPurchasedAt))) {
      base.lastPurchasedAt = tanggal;
    }
    aggregates.set(pid, base);
  }
  return Array.from(aggregates.values()).sort((a, b) => (b.totalQty - a.totalQty));
}