/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { Toko } from "@/types/management";

export async function fetchStores(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("toko")
    .select(`
      id,
      tenant_id,
      nama,
      kode,
      alamat,
      telepon,
      email,
      status,
      timezone,
      mata_uang,
      logo_url,
      settings,
      created_at,
      updated_at
    `)
    .eq("tenant_id", tenantId)
    .order("nama");

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    tenantId: item.tenant_id,
    nama: item.nama,
    kode: item.kode,
    alamat: item.alamat,
    telepon: item.telepon,
    email: item.email,
    status: item.status,
    timezone: item.timezone,
    mataUang: item.mata_uang,
    logoUrl: item.logo_url,
    settings: item.settings,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as Toko[]);
}