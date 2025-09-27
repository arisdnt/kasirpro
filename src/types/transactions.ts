export type SaleTransaction = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  bayar: number | null;
  kembalian: number | null;
  metodePembayaran: string | null;
  pelangganId: string | null;
  pelangganNama: string | null;
};

export type SaleItem = {
  id: string;
  transaksiId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};

export type PurchaseTransaction = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierId: string;
  supplierNama: string;
};

export type PurchaseItem = {
  id: string;
  transaksiId: string;
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  kategoriNama: string | null;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};

export type ReturnTransaction = {
  id: string;
  nomorRetur: string;
  tanggal: string;
  total: number;
  status: string | null;
  pelangganNama: string | null;
  alasan?: string | null;
  // Linking info to enable editing against the original sale
  transaksiPenjualanId?: string | null;
  pelangganId?: string | null;
  nomorTransaksiPenjualan?: string | null;
};

export type ReturnItem = {
  id: string;
  returId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};

export type PurchaseReturnTransaction = {
  id: string;
  nomorRetur: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierId: string;
  supplierNama: string;
  alasan: string | null;
  createdAt: string;
  updatedAt: string;
  transaksiPembelianId?: string | null;
};

export type PurchaseReturnItem = {
  id: string;
  returId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};

export type InternalMessage = {
  id: string;
  judul: string;
  isi: string;
  createdAt: string;
  status: string | null;
  readAt?: string | null;
  type?: string | null;
  priority?: string | null;
  pengirimId?: string;
  penerimaId?: string | null;
  tokoTargetId?: string | null;
};

// Input payload for creating/updating internal messages
export type InternalMessageInput = {
  judul: string;
  isi: string;
  status?: string | null; // e.g., 'draft' | 'terkirim' | 'dibaca'
  type?: string | null; // e.g., 'pesan', 'informasi', etc.
  priority?: string | null; // e.g., 'normal', 'tinggi', 'urgent'
  // Targeting
  penerimaId?: string | null; // optional direct user target
  tokoTargetId?: string | null; // by default current store if applicable
};

export type AuditEntry = {
  id: string;
  tabel: string;
  aksi: string;
  userId: string | null;
  createdAt: string;
};

export type NewsArticle = {
  id: string;
  judul: string;
  konten: string;
  status: "draft" | "aktif" | "nonaktif" | "kedaluwarsa";
  userId: string;
  authorName: string | null;
  tenantId: string;
  tokoId: string | null;
  tipeBerita: "informasi" | "pengumuman" | "peringatan" | "urgent";
  targetTampil: "toko_tertentu" | "semua_toko_tenant" | "semua_tenant";
  prioritas: "rendah" | "normal" | "tinggi" | "urgent";
  targetTokoIds: string[] | null;
  targetTenantIds: string[] | null;
  jadwalMulai: string | null;
  jadwalSelesai: string | null;
  intervalTampilMenit: number | null;
  maksimalTampil: number | null;
  viewCount: number;
  gambarUrl: string | null;
  lampiranUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
