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
  alamat?: string | null;
  kodePos?: string | null;
  npwp?: string | null;
  tempoPembayaran?: number | null; // days
  limitKredit?: number | null; // currency amount
  tokoId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};