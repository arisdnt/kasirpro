import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSalesReturnsQuery } from "@/features/returns/use-returns";
import { useReturnItemsQuery, useAddReturnItem, useUpdateReturnItem, useDeleteReturnItem, useSaleItemsWithReturnableQuery, useUpdateReturnHeader } from "@/features/returns/use-return-items";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface ReturnEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
  onReturnUpdated: () => void;
}

export function ReturnEditModal({
  open,
  onOpenChange,
  returnId,
  onReturnUpdated,
}: ReturnEditModalProps) {
  const returns = useSalesReturnsQuery();
  const items = useReturnItemsQuery(returnId);
  const addItem = useAddReturnItem(returnId);
  const updItem = useUpdateReturnItem(returnId);
  const delItem = useDeleteReturnItem(returnId);
  const updHeader = useUpdateReturnHeader();

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  const saleItems = useSaleItemsWithReturnableQuery(returnData?.transaksiPenjualanId ?? null);

  const [status, setStatus] = useState<"draft" | "diterima" | "sebagian" | "selesai" | "batal">("draft");
  const [alasan, setAlasan] = useState("");

  React.useEffect(() => {
    if (returnData) {
      setStatus(returnData.status as any ?? "draft");
      setAlasan(returnData.alasan ?? "");
    }
  }, [returnData]);

  const canEdit = (returnData?.status ?? "draft") === "draft";

  const handleSave = async () => {
    try {
      await updHeader.mutateAsync({
        id: returnId,
        status,
        alasan: alasan || null
      });
      toast.success("Retur berhasil diperbarui");
      onReturnUpdated();
      onOpenChange(false);
    } catch {
      toast.error("Gagal memperbarui retur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-black">Edit Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 border border-slate-200 bg-slate-50">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Retur</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorRetur}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  disabled={!canEdit}
                  className="h-8 w-full rounded-none border border-slate-200 bg-white px-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="diterima">Diterima</option>
                  <option value="sebagian">Sebagian</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Batal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Alasan</label>
                <input
                  type="text"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Alasan retur"
                  className="h-8 w-full rounded-none border border-slate-200 bg-white px-2 text-sm"
                />
              </div>
            </div>

            {canEdit && (
              <div>
                <select
                  disabled={saleItems.isLoading || (saleItems.data ?? []).length === 0}
                  className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
                  onChange={async (e) => {
                    const pid = e.target.value;
                    if (!pid) return;
                    type SaleItemWithReturnable = { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number };
                    const src = (saleItems.data as SaleItemWithReturnable[] | undefined)?.find((s) => s.produkId === pid);
                    if (!src || src.remainingReturnable <= 0) {
                      toast.error("Qty retur tidak tersedia");
                      return;
                    }
                    try {
                      await addItem.mutateAsync({ produkId: src.produkId, qty: 1, hargaSatuan: src.hargaSatuan });
                      toast.success("Item ditambahkan");
                    } catch {
                      toast.error("Gagal menambah item retur");
                    }
                  }}
                >
                  <option value="">+ Tambah item dari transaksi</option>
                  {((saleItems.data as { produkId: string; produkNama: string; remainingReturnable: number }[] | undefined) ?? []).map((s) => (
                    <option key={s.produkId} value={s.produkId} disabled={s.remainingReturnable <= 0}>
                      {s.produkNama} • sisa retur {s.remainingReturnable}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              {(items.data ?? []).map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center gap-2 p-3 border border-slate-200 bg-white text-sm">
                  <div className="col-span-5">
                    <div className="font-medium text-slate-800">{item.produkNama}</div>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      className="h-8 w-full rounded-none border border-slate-200 px-2"
                      defaultValue={item.qty}
                      disabled={!canEdit}
                      onBlur={async (e) => {
                        const val = Math.max(1, Number(e.currentTarget.value || 1));
                        try {
                          await updItem.mutateAsync({ id: item.id, qty: val, hargaSatuan: item.hargaSatuan });
                        } catch {
                          toast.error("Gagal mengupdate item");
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2 text-right">{formatCurrency(item.hargaSatuan)}</div>
                  <div className="col-span-2 text-right font-semibold">{formatCurrency(item.subtotal)}</div>
                  {canEdit && (
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                        onClick={async () => {
                          try {
                            await delItem.mutateAsync(item.id);
                          } catch {
                            toast.error("Gagal menghapus item");
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
            onClick={handleSave}
            disabled={updHeader.isPending}
          >
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}