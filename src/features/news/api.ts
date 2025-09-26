/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NewsArticle } from "@/types/transactions";

export async function fetchNews(tenantId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("berita")
    .select(`
      id,
      judul,
      konten,
      status,
      user_id,
      author:users(full_name),
      tenant_id,
      toko_id,
      tipe_berita,
      target_tampil,
      prioritas,
      target_toko_ids,
      target_tenant_ids,
      jadwal_mulai,
      jadwal_selesai,
      interval_tampil_menit,
      maksimal_tampil,
      gambar_url,
      lampiran_url,
      created_at,
      updated_at,
      view_count:berita_views(count)
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    judul: item.judul,
    konten: item.konten,
    status: item.status,
    userId: item.user_id,
    authorName: item.author?.full_name ?? null,
    tenantId: item.tenant_id,
    tokoId: item.toko_id ?? null,
    tipeBerita: item.tipe_berita,
    targetTampil: item.target_tampil,
    prioritas: item.prioritas,
    targetTokoIds: item.target_toko_ids ?? null,
    targetTenantIds: item.target_tenant_ids ?? null,
    jadwalMulai: item.jadwal_mulai ?? null,
    jadwalSelesai: item.jadwal_selesai ?? null,
    intervalTampilMenit: item.interval_tampil_menit ?? null,
    maksimalTampil: item.maksimal_tampil ?? null,
    gambarUrl: item.gambar_url ?? null,
    lampiranUrl: item.lampiran_url ?? null,
    viewCount: item.view_count?.[0]?.count ?? 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as NewsArticle[]);
}