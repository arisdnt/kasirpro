import { useMemo } from "react";
import { Button as HeroButton, Card, CardBody, CardHeader } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePurchaseProductsQuery } from "@/features/purchases/use-purchase-products";
import { useSuppliersQuery } from "@/features/suppliers/use-suppliers";
import { useQuickPurchaseMutation } from "@/features/purchase-entry/use-quick-purchase";
import { ProductSearch } from "./components/product-search";
import { PurchaseItemsList } from "./components/purchase-items-list";
import { SupplierSelector } from "./components/supplier-selector";
import { PurchaseSummary } from "./components/purchase-summary";
import { usePurchaseEntryState } from "./use-purchase-entry-state";
import type { Supplier } from "@/features/suppliers/types";

export function PurchaseEntryPage() {
  const { data: products = [] } = usePurchaseProductsQuery();
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliersQuery();
  const quickPurchase = useQuickPurchaseMutation();

  const {
    searchTerm,
    highlightIndex,
    items,
    supplierMode,
    selectedSupplierId,
    externalSupplierName,
    searchFocused,
    suggestions,
    totals,
    setSearchTerm,
    setHighlightIndex,
    setSupplierMode,
    setSelectedSupplierId,
    setExternalSupplierName,
    setSearchFocused,
    handleCommit,
    commitProduct,
    handleUpdateQty,
    handleUpdatePrice,
    handleRemoveItem,
    clearItems,
    ensureValid,
    resetAfterSubmit,
  } = usePurchaseEntryState(products);

  const submitPurchase = async (status: "draft" | "diterima") => {
    if (!ensureValid()) return;

    try {
      const result = await quickPurchase.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          harga: item.harga,
        })),
        supplierMode,
        supplierId: selectedSupplierId,
        externalSupplierName,
        status,
      });

      if (status === "draft") {
        toast.success(`Draft pembelian tersimpan • ${result.nomorTransaksi}`);
      } else {
        toast.success(`Transaksi pembelian berhasil dibuat • ${result.nomorTransaksi}`);
      }

      resetAfterSubmit(result.supplierId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memproses pembelian";
      toast.error(message);
    }
  };

  const activeSupplierName = useMemo(() => {
    if (supplierMode === "external") {
      return externalSupplierName.trim() || "Supplier Bebas";
    }
    const found = suppliers.find((supplier) => supplier.id === selectedSupplierId);
    return found?.nama ?? "Pilih supplier";
  }, [externalSupplierName, selectedSupplierId, supplierMode, suppliers]);

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-3 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 xl:grid-cols-[2.3fr_1fr]">
        <Card className="flex min-h-0 flex-col border border-emerald-100 bg-white/95 shadow-md rounded-none">
          <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex items-start gap-3">
              <ProductSearch
                searchTerm={searchTerm}
                highlightIndex={highlightIndex}
                searchFocused={searchFocused}
                suggestions={suggestions}
                onSearchChange={setSearchTerm}
                onFocusChange={setSearchFocused}
                onHighlightChange={setHighlightIndex}
                onCommit={handleCommit}
                onProductSelect={commitProduct}
              />
              <HeroButton
                className="h-12 gap-2 rounded-none bg-[#476EAE] px-5 text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70 disabled:opacity-80 data-[disabled=true]:bg-[#476EAE]/70 data-[disabled=true]:opacity-80"
                startContent={<Trash2 className="h-4 w-4" />}
                onPress={clearItems}
                isDisabled={items.length === 0}
              >
                Kosongkan
              </HeroButton>
            </div>

            <PurchaseItemsList
              items={items}
              onUpdateQty={handleUpdateQty}
              onUpdatePrice={handleUpdatePrice}
              onRemoveItem={handleRemoveItem}
            />
          </CardBody>
        </Card>

        <Card className="flex min-h-0 flex-col border border-sky-100 bg-white/95 shadow-md rounded-none">
          <CardHeader className="border-b border-sky-100 pb-3">
            <p className="text-sm font-semibold text-slate-800">Supplier</p>
          </CardHeader>
          <CardBody className="flex flex-1 flex-col gap-4">
            <SupplierSelector
              supplierMode={supplierMode}
              selectedSupplierId={selectedSupplierId}
              externalSupplierName={externalSupplierName}
              suppliers={suppliers as Supplier[]}
              loadingSuppliers={loadingSuppliers}
              activeSupplierName={activeSupplierName}
              onModeChange={setSupplierMode}
              onSupplierChange={setSelectedSupplierId}
              onExternalNameChange={setExternalSupplierName}
            />

            <PurchaseSummary
              totals={totals}
              isSubmitting={quickPurchase.isPending}
              hasItems={items.length > 0}
              onSubmitDraft={() => void submitPurchase("draft")}
              onSubmitPurchase={() => void submitPurchase("diterima")}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
