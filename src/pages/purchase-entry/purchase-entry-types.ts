import type { PurchaseProduct } from "@/features/purchases/use-purchase-products";

export type DraftItem = {
  productId: string;
  nama: string;
  kode: string;
  barcode: string | null;
  satuan: string | null;
  harga: number;
  qty: number;
  stok: number;
};

export type SupplierMode = "registered" | "external";

export interface PurchaseEntryTotals {
  totalQty: number;
  totalAmount: number;
}

export interface ProductSearchState {
  searchTerm: string;
  highlightIndex: number;
  searchFocused: boolean;
  suggestions: PurchaseProduct[];
}