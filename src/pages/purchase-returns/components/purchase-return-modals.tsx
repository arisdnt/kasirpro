import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { usePurchaseItemsWithReturnableQuery } from "@/features/purchase-returns/use-purchase-return-items";
import { useCreatePurchaseReturnDraft } from "@/features/purchase-returns/use-purchase-returns";
import { usePurchasesQuery } from "@/features/purchases/use-purchases";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface PurchaseReturnModalsProps {
  showCreateDialog: boolean;
  onCloseCreateDialog: () => void;
  showItemSelectionDialog: boolean;
  onCloseItemSelectionDialog: () => void;
  selectedModalPurchaseId: string;
  onSelectedModalPurchaseIdChange: (id: string) => void;
  selectedPurchaseForItems: string;
  onModalProceed: () => void;
  onReturnCreated: () => void;
}

export function PurchaseReturnModals({
  showCreateDialog,
  onCloseCreateDialog,
  showItemSelectionDialog,
  onCloseItemSelectionDialog,
  selectedModalPurchaseId,
  onSelectedModalPurchaseIdChange,
  selectedPurchaseForItems,
  onModalProceed,
  onReturnCreated,
}: PurchaseReturnModalsProps) {
  const purchases = usePurchasesQuery();

  return (
    <>
      {/* Create Purchase Return Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={onCloseCreateDialog}>
        <DialogContent className="rounded-none bg-white w-[65%] max-w-2xl border-2 border-[#A7E399]">
          <DialogTitle className="text-black">Buat Retur Pembelian</DialogTitle>
          <DialogDescription className="text-slate-600">
            Pilih transaksi pembelian yang akan dibuatkan retur draft.
          </DialogDescription>
          <div className="mt-4 flex flex-col gap-3">
            <select
              className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40 w-full"
              value={selectedModalPurchaseId}
              onChange={(e) => onSelectedModalPurchaseIdChange(e.target.value)}
            >
              <option value="">Pilih transaksi...</option>
              {(purchases.data ?? []).slice(0, 20).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomorTransaksi} • {p.supplierNama} • {new Date(p.tanggal).toLocaleDateString()}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
                onClick={onCloseCreateDialog}
              >
                Batal
              </Button>
              <Button
                className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
                disabled={!selectedModalPurchaseId}
                onClick={onModalProceed}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Selection Dialog */}
      <PurchaseItemSelectionDialog
        open={showItemSelectionDialog}
        onOpenChange={onCloseItemSelectionDialog}
        purchaseId={selectedPurchaseForItems}
        onReturnCreated={onReturnCreated}
      />
    </>
  );
}

function PurchaseItemSelectionDialog({
  open,
  onOpenChange,
  purchaseId,
  onReturnCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: string;
  onReturnCreated: () => void;
}) {
  const purchaseItems = usePurchaseItemsWithReturnableQuery(purchaseId);
  const createDraft = useCreatePurchaseReturnDraft();
  const purchases = usePurchasesQuery();
  const [selectedItems, setSelectedItems] = useState<{ produkId: string; qty: number; hargaSatuan: number }[]>([]);

  const selectedPurchase = useMemo(() => {
    return purchases.data?.find(p => p.id === purchaseId);
  }, [purchases.data, purchaseId]);

  const handleItemToggle = (produkId: string, qty: number, hargaSatuan: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.produkId === produkId);
      if (existing) {
        return prev.filter(item => item.produkId !== produkId);
      } else {
        return [...prev, { produkId, qty: 1, hargaSatuan }];
      }
    });
  };

  const handleQtyChange = (produkId: string, newQty: number) => {
    setSelectedItems(prev => prev.map(item =>
      item.produkId === produkId ? { ...item, qty: Math.max(1, newQty) } : item
    ));
  };

  const handleCreateReturn = async () => {
    if (!selectedPurchase || selectedItems.length === 0) return;

    try {
      // 1. Create return header
      const res = await createDraft.mutateAsync({
        purchaseId: selectedPurchase.id,
        supplierId: selectedPurchase.supplierId
      });

      // 2. Add selected items to the return using direct API call
      const { addPurchaseReturnItem } = await import("@/features/purchase-returns/api");

      for (const item of selectedItems) {
        await addPurchaseReturnItem({
          returId: res.id,
          produkId: item.produkId,
          qty: item.qty,
          hargaSatuan: item.hargaSatuan
        });
      }

      toast.success(`Draft retur dibuat: ${res.nomor_retur} dengan ${selectedItems.length} item`);
      setSelectedItems([]);
      onOpenChange(false);
      onReturnCreated();
    } catch (error) {
      console.error("Error creating purchase return:", error);
      toast.error("Gagal membuat draft retur pembelian");
    }
  };

  // Reset selected items when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedItems([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-w-2xl bg-white">
        <DialogTitle className="text-black">Pilih Item untuk Retur</DialogTitle>
        <DialogDescription className="text-slate-600">
          Transaksi: {selectedPurchase?.nomorTransaksi} • {selectedPurchase?.supplierNama}
        </DialogDescription>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {purchaseItems.isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (purchaseItems.data ?? []).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Tidak ada item yang dapat diretur dari transaksi ini
            </div>
          ) : (
            <div className="space-y-2">
              {((purchaseItems.data as { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number }[] | undefined) ?? [])
                .filter(item => item.remainingReturnable > 0)
                .map((item) => {
                  const isSelected = selectedItems.some(selected => selected.produkId === item.produkId);
                  const selectedItem = selectedItems.find(selected => selected.produkId === item.produkId);

                  return (
                    <div
                      key={item.produkId}
                      className={`border border-slate-200 p-3 ${isSelected ? 'bg-emerald-50 border-emerald-200' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemToggle(item.produkId, item.remainingReturnable, item.hargaSatuan)}
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium text-slate-900">{item.produkNama}</div>
                            <div className="text-sm text-slate-500">
                              Harga: {formatCurrency(item.hargaSatuan)} • Sisa dapat diretur: {item.remainingReturnable}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={item.remainingReturnable}
                              value={selectedItem?.qty ?? 1}
                              onChange={(e) => handleQtyChange(item.produkId, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 border border-slate-200 rounded-none px-2 text-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {selectedItems.length} item dipilih
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={selectedItems.length === 0 || createDraft.isPending}
              onClick={handleCreateReturn}
            >
              Buat Retur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}