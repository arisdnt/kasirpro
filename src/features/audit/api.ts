/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { AuditEntry } from "@/features/audit/types";

export async function fetchAuditLogs(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("audit_log")
    .select("id, tabel, aksi, user_id, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    tabel: item.tabel,
    aksi: item.aksi,
    userId: item.user_id,
    createdAt: item.created_at,
  })) as AuditEntry[]);
}