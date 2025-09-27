import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { AppUser, Role } from "./types";

type RawProfile = {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  status: string | null;
  tenant_id: string;
  toko_id: string | null;
  metadata: Record<string, unknown> | null;
  peran: {
    id: string;
    nama: string;
    level: number;
    permissions: Record<string, unknown> | null;
  } | null;
  tenant?: { id: string; nama: string | null } | null;
  toko?: { id: string; nama: string | null } | null;
};

export async function loadUserProfile(session: Session): Promise<AppUser> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("users")
    .select(
      `id, username, email, full_name, phone, status, tenant_id, toko_id, metadata,
       peran:peran_id ( id, nama, level, permissions ),
       tenant:tenant_id ( id, nama ),
       toko:toko_id ( id, nama )`
    )
    .eq("auth_user_id", session.user.id)
    .maybeSingle<RawProfile>();

  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Profil pengguna tidak ditemukan");
  }

  const role: Role | null = data.peran
    ? {
        id: data.peran.id,
        nama: data.peran.nama,
        level: data.peran.level,
        permissions: data.peran.permissions ?? {},
      }
    : null;

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    status: (data.status as AppUser["status"]) ?? "aktif",
    tenantId: data.tenant_id,
    tenantNama: data.tenant?.nama ?? null,
    tokoId: data.toko_id,
    tokoNama: data.toko?.nama ?? null,
    role,
    metadata: data.metadata,
  };
}

export function subscribeUserProfile(
  userId: string,
  onChange: () => void,
) {
  const client = getSupabaseClient();
  const channel = client
    .channel(`users-profile-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
