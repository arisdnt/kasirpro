import type { PurchaseProduct } from "@/features/purchases/use-purchase-products";
import type { DraftItem, PurchaseEntryTotals } from "./purchase-entry-types";

export const MAX_SUGGESTIONS = 8;

export function resolveBasePrice(product: PurchaseProduct): number {
  if (product.hargaBeli > 0) return product.hargaBeli;
  if (product.hargaJual && product.hargaJual > 0) return product.hargaJual;
  return 0;
}

export function calculateTotals(items: DraftItem[]): PurchaseEntryTotals {
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.harga, 0);
  return { totalQty, totalAmount };
}

export function getProductSuggestions(products: PurchaseProduct[], searchTerm: string): PurchaseProduct[] {
  const trimmed = searchTerm.trim();
  if (trimmed.length < 2) {
    return [];
  }
  const needle = trimmed.toLowerCase();
  return products
    .filter((product) =>
      product.nama.toLowerCase().includes(needle) ||
      product.kode.toLowerCase().includes(needle) ||
      (product.barcode ? product.barcode.toLowerCase().includes(needle) : false),
    )
    .slice(0, MAX_SUGGESTIONS);
}

export function findDirectMatch(products: PurchaseProduct[], searchTerm: string): PurchaseProduct | undefined {
  const trimmed = searchTerm.trim();
  const needle = trimmed.toLowerCase();

  return products.find(
    (product) =>
      product.kode.toLowerCase() === needle ||
      (product.barcode ? product.barcode.toLowerCase() === needle : false),
  );
}

export function addProductToDraft(items: DraftItem[], product: PurchaseProduct): DraftItem[] {
  const existing = items.find((item) => item.productId === product.id);
  if (existing) {
    return items.map((item) =>
      item.productId === product.id
        ? { ...item, qty: item.qty + 1 }
        : item,
    );
  }

  return [
    ...items,
    {
      productId: product.id,
      nama: product.nama,
      kode: product.kode,
      barcode: product.barcode,
      satuan: product.satuan,
      harga: resolveBasePrice(product),
      qty: 1,
      stok: product.stok,
    },
  ];
}

export function updateItemQuantity(items: DraftItem[], productId: string, qty: number): DraftItem[] {
  return items.map((item) =>
    item.productId === productId
      ? { ...item, qty: Math.max(1, Math.round(qty)) }
      : item,
  );
}

export function updateItemPrice(items: DraftItem[], productId: string, price: number): DraftItem[] {
  return items.map((item) =>
    item.productId === productId
      ? { ...item, harga: Math.max(0, price) }
      : item,
  );
}

export function removeItem(items: DraftItem[], productId: string): DraftItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function validatePurchaseData(
  items: DraftItem[],
  supplierMode: string,
  selectedSupplierId: string | null,
  externalSupplierName: string
): { isValid: boolean; error?: string } {
  if (items.length === 0) {
    return { isValid: false, error: "Keranjang pembelian masih kosong" };
  }

  if (supplierMode === "registered" && !selectedSupplierId) {
    return { isValid: false, error: "Pilih supplier terlebih dahulu" };
  }

  if (supplierMode === "external" && externalSupplierName.trim().length === 0) {
    return { isValid: false, error: "Masukkan nama supplier" };
  }

  return { isValid: true };
}