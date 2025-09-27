/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { InternalMessage, InternalMessageInput } from "@/types/transactions";

export async function fetchInternalMessages(tenantId: string, tokoId: string | null, currentUserId: string) {
  const client = getSupabaseClient();
  const query = client
    .from("perpesanan")
    .select(`
      id,
      pengirim_id,
      penerima_id,
      toko_target_id,
      judul,
      isi,
      status,
      tipe,
      prioritas,
      dibaca_pada,
      created_at,
      pengirim:users!perpesanan_pengirim_id_fkey(id, full_name, username),
      penerima:users!perpesanan_penerima_id_fkey(id, full_name, username)
    `)
    .eq("tenant_id", tenantId)
    .or(
      [
        `penerima_id.eq.${currentUserId}`,
        `pengirim_id.eq.${currentUserId}`,
        tokoId ? `toko_target_id.eq.${tokoId}` : undefined,
        `toko_target_id.is.null`,
      ]
        .filter(Boolean)
        .join(",")
    )
    .order("created_at", { ascending: false })
    .limit(50);

  // Do not add an additional toko_target_id eq filter here, since the OR above
  // already includes toko scope in addition to direct sender/receiver conditions.

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    pengirimId: item.pengirim_id,
    penerimaId: item.penerima_id ?? null,
    tokoTargetId: item.toko_target_id ?? null,
    judul: item.judul,
    isi: item.isi,
    status: item.status,
    type: item.tipe ?? null,
    priority: item.prioritas ?? null,
    readAt: item.dibaca_pada ?? null,
    createdAt: item.created_at,
    pengirimNama: item.pengirim?.full_name || item.pengirim?.username || "Tanpa Nama",
    penerimaNama: item.penerima?.full_name || item.penerima?.username || (item.toko_target_id ? "Semua pengguna toko" : "Semua pengguna tenant"),
  })) as InternalMessage[]);
}

export async function fetchUsersByStore(params: { tenantId: string; storeId: string }) {
  const client = getSupabaseClient();
  const { data, error } = await (client.from("users") as any)
    .select("id")
    .eq("tenant_id", params.tenantId)
    .eq("toko_id", params.storeId);
  if (error) throw error;
  return (data as { id: string }[]).map((r) => r.id);
}

export async function fetchUsersByTenant(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await (client.from("users") as any)
    .select("id")
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return (data as { id: string }[]).map((r) => r.id);
}

export async function createInternalMessagesBatch(params: {
  tenantId: string;
  pengirimId: string;
  tokoId: string | null; // context/default
  input: InternalMessageInput;
  recipientUserIds: string[];
  storeIdForContext?: string | null;
}) {
  const client = getSupabaseClient();
  const rows = params.recipientUserIds.map((uid) => ({
    tenant_id: params.tenantId,
    pengirim_id: params.pengirimId,
    penerima_id: uid,
    toko_target_id: params.storeIdForContext ?? params.tokoId ?? null,
    judul: params.input.judul,
    isi: params.input.isi,
    tipe: params.input.type ?? "pesan",
    prioritas: params.input.priority ?? "normal",
    status: params.input.status ?? "terkirim",
  }));
  if (rows.length === 0) return;
  const { error } = await (client.from("perpesanan") as any).insert(rows);
  if (error) throw error;
}

export async function createInternalMessage(params: {
  tenantId: string;
  pengirimId: string; // current user id
  tokoId: string | null; // default targeting if provided
  input: InternalMessageInput;
}) {
  const client = getSupabaseClient();
  const table = client.from("perpesanan") as any;
  const { error, data } = await table
    .insert({
      tenant_id: params.tenantId,
      pengirim_id: params.pengirimId,
      penerima_id: params.input.penerimaId ?? null,
      toko_target_id: params.input.tokoTargetId ?? params.tokoId ?? null,
      judul: params.input.judul,
      isi: params.input.isi,
      tipe: params.input.type ?? "pesan",
      prioritas: params.input.priority ?? "normal",
      status: params.input.status ?? "terkirim",
    })
    .select("id")
    .single();
  if (error) throw error;
  return (data?.id as string) ?? "";
}

export async function updateInternalMessage(params: {
  tenantId: string;
  messageId: string;
  input: Partial<InternalMessageInput> & { status?: string | null };
}) {
  const client = getSupabaseClient();
  const table = client.from("perpesanan") as any;
  const { error } = await table
    .update({
      judul: params.input.judul,
      isi: params.input.isi,
      tipe: params.input.type,
      prioritas: params.input.priority,
      status: params.input.status,
      penerima_id: params.input.penerimaId,
      toko_target_id: params.input.tokoTargetId,
    })
    .eq("id", params.messageId)
    .eq("tenant_id", params.tenantId);
  if (error) throw error;
}

export async function deleteInternalMessage(params: { tenantId: string; messageId: string }) {
  const client = getSupabaseClient();
  const table = client.from("perpesanan") as any;
  const { error } = await table
    .delete()
    .eq("id", params.messageId)
    .eq("tenant_id", params.tenantId);
  if (error) throw error;
}

export async function markInternalMessageRead(params: { tenantId: string; messageId: string }) {
  const client = getSupabaseClient();
  const table = client.from("perpesanan") as any;
  const { error } = await table
    .update({ status: "dibaca", dibaca_pada: new Date().toISOString() })
    .eq("id", params.messageId)
    .eq("tenant_id", params.tenantId);
  if (error) throw error;
}