import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddPurchaseReturnItem,
  useDeletePurchaseReturn,
  useDeletePurchaseReturnItem,
  usePurchaseItemsWithReturnableQuery,
  usePurchaseReturnItemsQuery,
  useUpdatePurchaseReturnHeader,
  useUpdatePurchaseReturnItem,
} from "@/features/purchase-returns/use-purchase-return-items";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface PurchaseReturnItem {
  id: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
}

interface PurchaseReturnEditorProps {
  returId: string;
  transaksiId: string | null;
  selectedReturn: {
    id: string;
    status: string | null;
    alasan: string | null;
    tanggal: string;
  };
  onDeleted?: () => void;
}

export function PurchaseReturnEditor({
  returId,
  transaksiId,
  selectedReturn,
  onDeleted
}: PurchaseReturnEditorProps) {
  const items = usePurchaseReturnItemsQuery(returId);
  const purchaseItems = usePurchaseItemsWithReturnableQuery(transaksiId);
  const addItem = useAddPurchaseReturnItem(returId);
  const updItem = useUpdatePurchaseReturnItem(returId);
  const delItem = useDeletePurchaseReturnItem(returId);
  const updHeader = useUpdatePurchaseReturnHeader();
  const delHeader = useDeletePurchaseReturn();

  const canEdit = (selectedReturn.status ?? "draft") === "draft";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">Item Retur Pembelian</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            disabled={delHeader.isPending || !canEdit}
            onClick={async () => {
              try {
                await delHeader.mutateAsync(returId);
                toast.success("Retur pembelian dihapus");
                onDeleted?.();
              } catch {
                toast.error("Gagal menghapus retur pembelian");
              }
            }}
          >
            Hapus Retur
          </Button>
          <select
            disabled={!canEdit || purchaseItems.isLoading || (purchaseItems.data ?? []).length === 0}
            className="h-9 rounded-none border border-slate-200 bg-white px-2 text-xs text-black shadow-inner"
            onChange={async (e) => {
              const pid = e.target.value;
              if (!pid) return;
              type PurchaseItemWithReturnable = { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number };
              const src = (purchaseItems.data as PurchaseItemWithReturnable[] | undefined)?.find((s) => s.produkId === pid);
              if (!src || src.remainingReturnable <= 0) {
                toast.error("Qty retur tidak tersedia");
                return;
              }
              try {
                await addItem.mutateAsync({ produkId: src.produkId, qty: 1, hargaSatuan: src.hargaSatuan });
                e.currentTarget.value = "";
              } catch {
                toast.error("Gagal menambah item retur pembelian");
              }
            }}
          >
            <option value="">+ Tambah item dari transaksi</option>
            {((purchaseItems.data as { produkId: string; produkNama: string; remainingReturnable: number }[] | undefined) ?? []).map((s) => (
              <option key={s.produkId} value={s.produkId} disabled={s.remainingReturnable <= 0}>
                {s.produkNama} • sisa retur {s.remainingReturnable}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 p-3">
        {items.isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (items.data ?? []).length === 0 ? (
          <div className="text-xs text-slate-500">Belum ada item retur.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {(items.data ?? []).map((it: PurchaseReturnItem) => (
              <div key={it.id} className="grid grid-cols-12 items-center gap-2 rounded border border-slate-200 p-2 text-xs">
                <div className="col-span-5">
                  <div className="font-medium text-slate-800">{it.produkNama}</div>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    className="h-8 w-full rounded-none border border-slate-200 px-2"
                    defaultValue={it.qty}
                    disabled={!canEdit}
                    onBlur={async (e) => {
                      const val = Math.max(1, Number(e.currentTarget.value || 1));
                      try {
                        await updItem.mutateAsync({ id: it.id, qty: val, hargaSatuan: it.hargaSatuan });
                      } catch {
                        toast.error("Gagal mengupdate item");
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 text-right font-mono">{formatCurrency(it.hargaSatuan)}</div>
                <div className="col-span-2 text-right font-mono font-semibold">{formatCurrency(it.subtotal)}</div>
                {canEdit && (
                  <div className="col-span-12 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      onClick={async () => {
                        try {
                          await delItem.mutateAsync(it.id);
                        } catch {
                          toast.error("Gagal menghapus item");
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status:</span>
            <select
              className="h-8 rounded-none border border-slate-200 bg-white px-2"
              defaultValue={selectedReturn.status ?? "draft"}
              disabled={!canEdit}
              onChange={async (e) => {
                try {
                  const v = e.target.value as "draft" | "diterima" | "sebagian" | "selesai" | "batal";
                  await updHeader.mutateAsync({ id: returId, status: v });
                  toast.success("Status diperbarui");
                } catch {
                  toast.error("Gagal memperbarui status");
                }
              }}
            >
              <option value="draft">draft</option>
              <option value="diterima">diterima</option>
              <option value="sebagian">sebagian</option>
              <option value="selesai">selesai</option>
              <option value="batal">batal</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Alasan:</span>
            <input
              className="h-8 w-48 rounded-none border border-slate-200 px-2"
              placeholder="Alasan retur"
              defaultValue={selectedReturn.alasan ?? ""}
              disabled={!canEdit}
              onBlur={async (e) => {
                try {
                  await updHeader.mutateAsync({ id: returId, alasan: e.currentTarget.value });
                } catch {
                  toast.error("Gagal memperbarui alasan");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}