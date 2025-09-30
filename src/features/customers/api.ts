import { getSupabaseClient } from "@/lib/supabase-client";
import type { Customer, CustomerInput } from "@/features/customers/types";

type PelangganRow = {
  id: string;
  kode: string;
  nama: string;
  telepon: string | null;
  email: string | null;
  alamat: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  poin_rewards: number | null;
  total_transaksi: number | null;
  frekuensi_transaksi: number | null;
  status: string | null;
  toko_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchCustomers(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("pelanggan")
    .select(`
      id,
      kode,
      nama,
      telepon,
      email,
      alamat,
      tanggal_lahir,
      jenis_kelamin,
      poin_rewards,
      total_transaksi,
      frekuensi_transaksi,
      status,
      toko_id,
      created_at,
      updated_at
    `)
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows: PelangganRow[] = (data ?? []) as PelangganRow[];
  return rows.map((item) => ({
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    telepon: item.telepon,
    email: item.email,
    alamat: item.alamat,
    tanggalLahir: item.tanggal_lahir,
    jenisKelamin: item.jenis_kelamin,
    poinRewards: item.poin_rewards,
    totalTransaksi: item.total_transaksi,
    frekuensiTransaksi: item.frekuensi_transaksi,
    status: item.status,
    tokoId: item.toko_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) satisfies Customer[];
}

function normalizeString(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function mapInputToColumns(input: CustomerInput) {
  return {
    kode: input.kode.trim(),
    nama: input.nama.trim(),
    status: input.status?.trim() || "aktif",
    telepon: normalizeString(input.telepon),
    email: normalizeString(input.email),
    alamat: normalizeString(input.alamat),
    tanggal_lahir: normalizeString(input.tanggalLahir),
    jenis_kelamin: normalizeString(input.jenisKelamin),
    toko_id: normalizeString(input.tokoId) ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function createCustomer(params: { tenantId: string; input: CustomerInput }) {
  const client = getSupabaseClient();
  const payload = mapInputToColumns(params.input);
  const { error } = await client
    .from("pelanggan")
    .insert({ ...payload, tenant_id: params.tenantId, created_at: new Date().toISOString() } as any);

  if (error) throw error;
}

export async function updateCustomer(params: { id: string; tenantId: string; input: CustomerInput }) {
  const client = getSupabaseClient();
  const payload = mapInputToColumns(params.input);
  const { error } = await client
    .from("pelanggan")
    .update(payload as any)
    .eq("id", params.id)
    .eq("tenant_id", params.tenantId);

  if (error) throw error;
}

export async function deleteCustomer(params: { id: string; tenantId: string }) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("pelanggan")
    .delete()
    .eq("id", params.id)
    .eq("tenant_id", params.tenantId);

  if (error) throw error;
}
