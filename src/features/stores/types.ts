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