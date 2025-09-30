/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { SystemConfig, SystemConfigInput } from "@/features/system-config/types";

type RawConfig = {
  id: string;
  tenant_id: string;
  toko_id: string | null;
  key: string;
  value: string | null;
  tipe: string | null;
  deskripsi: string | null;
  created_at: string | null;
  updated_at: string | null;
  toko?: { nama?: string | null } | null;
};

function mapConfig(row: RawConfig): SystemConfig {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    tokoId: row.toko_id,
    tokoNama: row.toko?.nama ?? null,
    key: row.key,
    value: row.value,
    tipe: row.tipe,
    deskripsi: row.deskripsi,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchSystemConfigs(tenantId: string) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("konfigurasi_sistem")
    .select(
      `
        id,
        tenant_id,
        toko_id,
        key,
        value,
        tipe,
        deskripsi,
        created_at,
        updated_at,
        toko:toko_id ( nama )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("key", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((row) => mapConfig(row as RawConfig));
}

function mapInputToColumns(input: SystemConfigInput, tenantId: string) {
  return {
    tenant_id: tenantId,
    key: input.key.trim(),
    value: input.value,
    tipe: input.tipe ?? null,
    deskripsi: input.deskripsi ?? null,
    toko_id: input.tokoId ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function createSystemConfig(params: { tenantId: string; input: SystemConfigInput }) {
  const client = getSupabaseClient();
  const payload = mapInputToColumns(params.input, params.tenantId);
  const { error } = await client
    .from("konfigurasi_sistem")
    .insert({ ...payload, created_at: new Date().toISOString() });

  if (error) {
    throw error;
  }
}

export async function updateSystemConfig(params: { id: string; tenantId: string; input: SystemConfigInput }) {
  const client = getSupabaseClient();
  const payload = mapInputToColumns(params.input, params.tenantId);
  const { error } = await client
    .from("konfigurasi_sistem")
    .update(payload)
    .eq("id", params.id)
    .eq("tenant_id", params.tenantId);

  if (error) {
    throw error;
  }
}

export async function deleteSystemConfig(params: { id: string; tenantId: string }) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("konfigurasi_sistem")
    .delete()
    .eq("id", params.id)
    .eq("tenant_id", params.tenantId);

  if (error) {
    throw error;
  }
}
