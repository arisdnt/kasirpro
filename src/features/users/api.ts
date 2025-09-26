/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { ManagementUser } from "@/types/management";

export async function fetchUsers(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("users")
    .select(`
      id,
      username,
      email,
      full_name,
      phone,
      status,
      tenant_id,
      tenant:tenants(nama),
      toko_id,
      toko:toko(nama),
      peran_id,
      peran:peran(nama, level),
      last_login,
      created_at,
      updated_at
    `)
    .eq("tenant_id", tenantId)
    .order("username");

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    username: item.username,
    email: item.email,
    fullName: item.full_name,
    phone: item.phone,
    status: item.status,
    tenantId: item.tenant_id,
  tenantNama: item.tenant?.nama ?? null,
    tokoId: item.toko_id,
    tokoNama: item.toko?.nama ?? null,
    roleId: item.peran_id,
    roleName: item.peran?.nama ?? null,
    roleLevel: item.peran?.level ?? null,
    lastLogin: item.last_login,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as ManagementUser[]);
}