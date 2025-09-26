import { getSupabaseClient } from "@/lib/supabase-client";
import type { Supplier } from "@/types/partners";

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