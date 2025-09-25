export type Customer = {
  id: string;
  kode: string;
  nama: string;
  telepon: string | null;
  email: string | null;
  poinRewards: number | null;
  totalTransaksi: number | null;
  frekuensiTransaksi: number | null;
  status: string | null;
};

export type Supplier = {
  id: string;
  kode: string;
  nama: string;
  kontakPerson: string | null;
  telepon: string | null;
  email: string | null;
  status: string | null;
  kota: string | null;
  provinsi: string | null;
};
