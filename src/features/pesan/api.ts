/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { InternalMessage } from "@/types/transactions";

export async function fetchInternalMessages(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("perpesanan")
    .select(`
      id,
      judul,
      isi,
      status,
      tipe,
      prioritas,
      dibaca_pada,
      created_at
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (tokoId) {
    query.eq("toko_target_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    judul: item.judul,
    isi: item.isi,
    status: item.status,
    type: item.tipe ?? null,
    priority: item.prioritas ?? null,
    readAt: item.dibaca_pada ?? null,
    createdAt: item.created_at,
  })) as InternalMessage[]);
}