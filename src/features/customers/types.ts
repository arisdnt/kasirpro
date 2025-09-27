export type Customer = {
  id: string;
  kode: string;
  nama: string;
  telepon: string | null;
  email: string | null;
  alamat?: string | null;
  tanggalLahir?: string | null;
  jenisKelamin?: string | null;
  poinRewards: number | null;
  totalTransaksi: number | null;
  frekuensiTransaksi: number | null;
  status: string | null;
  tokoId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};