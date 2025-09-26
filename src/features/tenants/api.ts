/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { Tenant } from "@/types/management";

export async function fetchTenants() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("tenants")
    .select(`
      id,
      nama,
      alamat,
      telepon,
      email,
      status,
      paket,
      max_pengguna,
      max_toko,
      created_at,
      updated_at
    `)
    .order("nama");

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nama: item.nama,
    alamat: item.alamat,
    telepon: item.telepon,
    email: item.email,
    status: item.status,
    // map paket -> rencana for UI compatibility
    rencana: item.paket,
    // map limits to expected names
    batasUser: item.max_pengguna,
    batasToko: item.max_toko,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as Tenant[]);
}