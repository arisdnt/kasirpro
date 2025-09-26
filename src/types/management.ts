export type Tenant = {
  id: string;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  status: "aktif" | "nonaktif" | "suspended";
  rencana: string | null;
  batasUser: number | null;
  batasToko: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Toko = {
  id: string;
  tenantId: string;
  nama: string;
  kode: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  status: "aktif" | "nonaktif" | "maintenance";
  timezone: string | null;
  mataUang: string | null;
  logoUrl: string | null;
  settings: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

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