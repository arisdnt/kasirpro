export type PosProduct = {
  id: string;
  nama: string;
  kode: string;
  hargaJual: number;
  stok: number;
  satuan: string | null;
  gambarUrl: string | null;
  brandNama: string | null;
  kategoriNama: string | null;
};

export type CartItem = {
  product: PosProduct;
  quantity: number;
  discount: number;
};

export type PaymentPayload = {
  amountPaid: number;
  method: string;
};
