import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateSalesReturnDraft } from "@/features/returns/use-returns";
import { useSaleItemsWithReturnableQuery } from "@/features/returns/use-return-items";
import { useSalesQuery } from "@/features/sales/use-sales";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface ItemSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
  onReturnCreated: () => void;
}

export function ItemSelectionDialog({
  open,
  onOpenChange,
  saleId,
  onReturnCreated,
}: ItemSelectionDialogProps) {
  const saleItems = useSaleItemsWithReturnableQuery(saleId);
  const createDraft = useCreateSalesReturnDraft();
  const sales = useSalesQuery();
  const [selectedItems, setSelectedItems] = useState<{ produkId: string; qty: number; hargaSatuan: number }[]>([]);

  const selectedSale = useMemo(() => {
    return sales.data?.find(s => s.id === saleId);
  }, [sales.data, saleId]);

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
    if (!selectedSale || selectedItems.length === 0) return;

    try {
      const res = await createDraft.mutateAsync({
        saleId: selectedSale.id,
        pelangganId: selectedSale.pelangganId
      });

      const { addReturnItem } = await import("@/features/returns/api");

      for (const item of selectedItems) {
        await addReturnItem({
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
      console.error("Error creating return:", error);
      toast.error("Gagal membuat draft retur");
    }
  };

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
          Transaksi: {selectedSale?.nomorTransaksi} • {selectedSale?.pelangganNama ?? "Umum"}
        </DialogDescription>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {saleItems.isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (saleItems.data ?? []).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Tidak ada item yang dapat diretur dari transaksi ini
            </div>
          ) : (
            <div className="space-y-2">
              {((saleItems.data as { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number }[] | undefined) ?? [])
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