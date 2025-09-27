/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@/features/kategori/types";
import { getSupabaseClient } from "@/lib/supabase-client";

type RawCategory = {
  id: string;
  nama: string;
  parent_id: string | null;
  toko_id: string | null;
};

export async function fetchCategories(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("kategori")
    .select("id, nama, parent_id, toko_id")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = (await query) as { data: RawCategory[] | null; error: any };
  if (error) throw error;

  return (
    (data ?? []).map((item) => ({
      id: item.id,
      nama: item.nama,
      parentId: item.parent_id,
      tokoId: item.toko_id,
    })) ?? []
  ) satisfies Category[];
}

export async function createCategory(params: {
  tenantId: string;
  nama: string;
  parentId?: string | null;
  tokoId?: string | null;
}) {
  const client = getSupabaseClient();
  const payload = {
    tenant_id: params.tenantId,
    nama: params.nama,
    parent_id: params.parentId ?? null,
    toko_id: params.tokoId ?? null,
  } as const;

  const { data, error } = (await client
    .from("kategori")
    .insert(payload as never)
    .select("id, nama, parent_id, toko_id")
    .single()) as { data: RawCategory; error: any };
  if (error) throw error;
  return {
    id: data.id,
    nama: data.nama,
    parentId: data.parent_id,
    tokoId: data.toko_id,
  } satisfies Category;
}

export async function updateCategory(id: string, params: {
  tenantId: string;
  nama?: string;
  parentId?: string | null;
  tokoId?: string | null;
}) {
  const client = getSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (typeof params.nama !== "undefined") patch.nama = params.nama;
  if (typeof params.parentId !== "undefined") patch.parent_id = params.parentId;
  if (typeof params.tokoId !== "undefined") patch.toko_id = params.tokoId;

  const { data, error } = (await client
    .from("kategori")
    .update(patch as never)
    .eq("tenant_id", params.tenantId)
    .eq("id", id)
    .select("id, nama, parent_id, toko_id")
    .single()) as { data: RawCategory; error: any };
  if (error) throw error;
  return {
    id: data.id,
    nama: data.nama,
    parentId: data.parent_id,
    tokoId: data.toko_id,
  } satisfies Category;
}

export async function deleteCategory(id: string, tenantId: string) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("kategori")
    .delete()
    .eq("tenant_id", tenantId)
    .eq("id", id);
  if (error) throw error;
}
