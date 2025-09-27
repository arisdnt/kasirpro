export type ManagementUser = {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  status: "aktif" | "nonaktif" | "suspended" | "cuti";
  tenantId: string;
  tenantNama: string | null;
  tokoId: string | null;
  tokoNama: string | null;
  roleId: string | null;
  roleName: string | null;
  roleLevel: number | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};