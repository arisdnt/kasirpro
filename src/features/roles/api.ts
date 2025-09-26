/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { ManagementRole } from "@/features/auth/types";

export async function fetchRoles(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("peran")
    .select(`
      id,
      nama,
      level,
      permissions,
      deskripsi,
      tenant_id,
      created_at,
      updated_at,
      user_count:users(count)
    `)
    .eq("tenant_id", tenantId)
    .order("level");

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nama: item.nama,
    level: item.level,
    permissions: item.permissions ?? {},
    deskripsi: item.deskripsi,
    // peran table doesn't have is_active; treat as active by default
    isActive: true,
    tenantId: item.tenant_id,
    userCount: item.user_count?.[0]?.count ?? 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as ManagementRole[]);
}