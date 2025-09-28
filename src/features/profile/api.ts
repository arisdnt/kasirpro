/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { DetailedUser, UserMetrics } from "./types";

type RawUser = {
  id: string;
  auth_user_id?: string | null;
  username: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  status?: string | null;
  tenant_id: string;
  toko_id: string | null;
  metadata?: Record<string, unknown> | null;
  peran?: { id: string; nama: string; level: number } | null;
  tenant?: { id: string; nama: string | null } | null;
  toko?: { id: string; nama: string | null } | null;
  last_login?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function fetchMyProfile(authUserId: string): Promise<DetailedUser> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("users")
    .select(
      `id, auth_user_id, username, email, full_name, phone, status, tenant_id, toko_id, metadata,
       peran:peran_id ( id, nama, level ),
       tenant:tenant_id ( id, nama ),
       toko:toko_id ( id, nama ),
       last_login, created_at, updated_at`
    )
    .eq("auth_user_id", authUserId)
  .maybeSingle<RawUser>();

  if (error) throw error;
  if (!data) throw new Error("Profil tidak ditemukan");

  return {
    id: data.id,
    authUserId: data.auth_user_id ?? null,
    username: data.username,
    email: data.email ?? null,
    fullName: data.full_name ?? null,
    phone: data.phone ?? null,
    status: data.status ?? null,
    tenantId: data.tenant_id,
    tenantNama: data.tenant?.nama ?? null,
    tokoId: data.toko_id,
    tokoNama: data.toko?.nama ?? null,
    role: data.peran ? { id: data.peran.id, nama: data.peran.nama, level: data.peran.level } : null,
    metadata: (data.metadata ?? {}) as Record<string, unknown>,
    lastLogin: data.last_login ?? null,
    createdAt: data.created_at ?? null,
    updatedAt: data.updated_at ?? null,
  } as DetailedUser;
}

export async function fetchMyMetrics(tenantId: string, userId: string): Promise<UserMetrics> {
  const client = getSupabaseClient();

  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Count audit logs
  const audit7 = await client
    .from("audit_log")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .gte("created_at", since7);

  const audit30 = await client
    .from("audit_log")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .gte("created_at", since30);

  // Content created by this user (promo/news)
  const promos = await client
    .from("promo")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("user_id", userId);

  const news = await client
    .from("berita")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("user_id", userId);

  // Last activity from audit log
  const lastActivity = await client
    .from("audit_log")
    .select("created_at")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  return {
    auditLast7d: audit7.count ?? 0,
    auditLast30d: audit30.count ?? 0,
    promosCreated: promos.count ?? 0,
    newsCreated: news.count ?? 0,
    lastActivityAt: (lastActivity.data as { created_at: string }[] | null | undefined)?.[0]?.created_at ?? null,
  } as UserMetrics;
}
