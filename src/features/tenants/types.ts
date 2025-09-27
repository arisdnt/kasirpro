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