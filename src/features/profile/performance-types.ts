export type MySaleRow = {
  id: string;
  nomor: string;
  tanggal: string;
  total: number;
  pelangganNama: string | null;
  metodePembayaran: string | null;
};

export type MyPurchaseRow = {
  id: string;
  nomor: string;
  tanggal: string;
  total: number;
  supplierNama: string | null;
  status: string | null;
};

export type MySalesReturnRow = {
  id: string;
  nomor: string;
  tanggal: string;
  total: number;
  status: string | null;
  pelangganNama: string | null;
};

export type MyPurchaseReturnRow = {
  id: string;
  nomor: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierNama: string | null;
};

export type ActivitySeriesPoint = {
  date: string; // YYYY-MM-DD
  salesTotal: number;
  salesCount: number;
  purchaseTotal: number;
  purchaseCount: number;
  salesReturnTotal: number;
  purchaseReturnTotal: number;
};
