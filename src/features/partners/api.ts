import { getSupabaseClient } from "@/lib/supabase-client";
import type { Customer, Supplier } from "@/types/partners";

export async function fetchCustomers(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("pelanggan")
    .select(
      "id, kode, nama, telepon, email, poin_rewards, total_transaksi, frekuensi_transaksi, status, toko_id"
    )
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (
    data?.map((item) => ({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      telepon: item.telepon,
      email: item.email,
      poinRewards: item.poin_rewards,
      totalTransaksi: item.total_transaksi,
      frekuensiTransaksi: item.frekuensi_transaksi,
      status: item.status,
    })) ?? []
  ) satisfies Customer[];
}

export async function fetchSuppliers(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("supplier")
    .select("id, kode, nama, kontak_person, telepon, email, status, kota, provinsi, toko_id")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (
    data?.map((item) => ({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      kontakPerson: item.kontak_person,
      telepon: item.telepon,
      email: item.email,
      status: item.status,
      kota: item.kota,
      provinsi: item.provinsi,
    })) ?? []
  ) satisfies Supplier[];
}
