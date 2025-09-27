export type RolePermission = Record<string, unknown>;

export type Role = {
  id: string;
  nama: string;
  level: number;
  permissions: RolePermission;
};

export type ManagementRole = {
  id: string;
  nama: string;
  level: number;
  permissions: RolePermission;
  deskripsi: string | null;
  isActive: boolean;
  tenantId: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AppUser = {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  status: "aktif" | "nonaktif" | "suspended" | "cuti";
  tenantId: string;
  tenantNama?: string | null;
  tokoId: string | null;
  tokoNama?: string | null;
  role: Role | null;
  metadata: Record<string, unknown> | null;
};

export type AuthState = {
  isLoading: boolean;
  user: AppUser | null;
  session: import("@supabase/supabase-js").Session | null;
};
