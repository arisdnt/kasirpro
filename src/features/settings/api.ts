import { getSupabaseClient } from "@/lib/supabase-client";

type Tenant = {
  id: string;
  nama: string;
  email: string;
  telepon: string | null;
  paket: string | null;
  status: string | null;
};

type Store = {
  id: string;
  nama: string;
  kode: string;
  status: string | null;
};

export async function fetchTenant(id: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("tenants")
    .select("id, nama, email, telepon, paket, status")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Tenant | null;
}

export async function fetchStores(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("toko")
    .select("id, nama, kode, status")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (error) throw error;
  return (data ?? []) as Store[];
}
