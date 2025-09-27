import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { PurchaseProduct } from "@/features/purchases/use-purchase-products";
import type { DraftItem, SupplierMode } from "./purchase-entry-types";
import {
  calculateTotals,
  getProductSuggestions,
  findDirectMatch,
  addProductToDraft,
  updateItemQuantity,
  updateItemPrice,
  removeItem,
  validatePurchaseData,
} from "./purchase-entry-utils";

export function usePurchaseEntryState(products: PurchaseProduct[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [supplierMode, setSupplierMode] = useState<SupplierMode>("registered");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [externalSupplierName, setExternalSupplierName] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setHighlightIndex(0);
  }, [searchTerm]);

  const suggestions = useMemo(() => getProductSuggestions(products, searchTerm), [products, searchTerm]);

  useEffect(() => {
    if (highlightIndex >= suggestions.length) {
      setHighlightIndex(suggestions.length > 0 ? suggestions.length - 1 : 0);
    }
  }, [highlightIndex, suggestions]);

  const totals = useMemo(() => calculateTotals(items), [items]);

  const handleAddProduct = (product: PurchaseProduct) => {
    setItems((prev) => addProductToDraft(prev, product));
  };

  const commitProduct = (product: PurchaseProduct) => {
    handleAddProduct(product);
    setSearchTerm("");
    setHighlightIndex(0);
  };

  const handleCommit = () => {
    const direct = findDirectMatch(products, searchTerm);
    const candidate = direct ?? suggestions[highlightIndex] ?? suggestions[0];
    if (!candidate) {
      toast.error("Produk tidak ditemukan");
      return;
    }
    commitProduct(candidate);
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    setItems((prev) => updateItemQuantity(prev, productId, qty));
  };

  const handleUpdatePrice = (productId: string, price: number) => {
    setItems((prev) => updateItemPrice(prev, productId, price));
  };

  const handleRemoveItem = (productId: string) => {
    setItems((prev) => removeItem(prev, productId));
  };

  const ensureValid = () => {
    const validation = validatePurchaseData(items, supplierMode, selectedSupplierId, externalSupplierName);
    if (!validation.isValid && validation.error) {
      toast.error(validation.error);
    }
    return validation.isValid;
  };

  const clearItems = () => setItems([]);

  const resetAfterSubmit = (supplierId?: string) => {
    setItems([]);
    setSearchTerm("");
    setHighlightIndex(0);

    if (supplierMode === "external" && supplierId) {
      setSupplierMode("registered");
      setSelectedSupplierId(supplierId);
      setExternalSupplierName("");
    }
  };

  return {
    // State
    searchTerm,
    highlightIndex,
    items,
    supplierMode,
    selectedSupplierId,
    externalSupplierName,
    searchFocused,
    suggestions,
    totals,

    // Setters
    setSearchTerm,
    setHighlightIndex,
    setSupplierMode,
    setSelectedSupplierId,
    setExternalSupplierName,
    setSearchFocused,

    // Handlers
    handleCommit,
    commitProduct,
    handleUpdateQty,
    handleUpdatePrice,
    handleRemoveItem,
    clearItems,
    ensureValid,
    resetAfterSubmit,
  };
}