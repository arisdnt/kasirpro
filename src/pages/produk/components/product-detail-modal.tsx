import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/products";
import type { StockMovement } from "@/types/inventory";
import { formatDateTime } from "@/lib/format";
import { useProductMovements } from "@/features/produk/queries/use-product-movements";
import { X } from "lucide-react";

type ProductDetailModalProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStock: number | null;
  movementLimit?: number;
  showAllMovements?: boolean;
};

type TimelineRow = StockMovement & {
  runningQty: number;
};

const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  currentStock,
  movementLimit = 60,
  showAllMovements = false,
}: ProductDetailModalProps) {
  const movementsQuery = useProductMovements(
    product?.id ?? null,
    showAllMovements ? 999999 : movementLimit
  );

  const timeline = useMemo<TimelineRow[]>(() => {
    if (!product || !movementsQuery.data) return [];
    const ordered = [...movementsQuery.data].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const totalChange = ordered.reduce((acc, item) => acc + item.qtyChange, 0);
    const origin = (currentStock ?? 0) - totalChange;
    let running = origin;
    return ordered.map((item) => {
      running += item.qtyChange;
      return { ...item, runningQty: running } satisfies TimelineRow;
    });
  }, [currentStock, movementsQuery.data, product]);

  const totals = useMemo(() => {
    const base = { in: 0, out: 0, adj: 0 };
    if (!movementsQuery.data) return base;
    return movementsQuery.data.reduce((acc, item) => {
      if (item.type === "IN") acc.in += item.qtyChange;
      if (item.type === "OUT") acc.out += Math.abs(item.qtyChange);
      if (item.type === "ADJ") acc.adj += item.qtyChange;
      return acc;
    }, base);
  }, [movementsQuery.data]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onOpenChange(false);
      }}
    >
      <DialogContent className="h-[70vh] max-h-[70vh] w-[65%] max-w-[65%] overflow-hidden border-2 border-[#A7E399] bg-white p-0 shadow-2xl rounded-none">
        <div className="flex h-full flex-col">
          <DialogHeader className="flex-none border-b border-slate-200/80 bg-white/90 px-6 py-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 mb-1">
                    {product?.nama ?? "Detail Produk"}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo Aktual:</span>
                      <span className="text-base font-bold text-slate-900">
                        {numberFormatter.format(currentStock ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Total Masuk:</span>
                      <span className="text-base font-bold text-emerald-700">
                        {numberFormatter.format(totals.in)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">Total Keluar:</span>
                      <span className="text-base font-bold text-rose-700">
                        {numberFormatter.format(totals.out)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Penyesuaian:</span>
                      <span className="text-base font-bold text-indigo-700">
                        {numberFormatter.format(totals.adj)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {showAllMovements ? `${timeline.length} total catatan` : `${movementLimit} catatan terakhir`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product ? (
                    <Button
                      variant={product.status === "aktif" ? "outline" : "destructive"}
                      size="sm"
                      className="rounded-none border border-slate-300/80 bg-white h-8 px-3 text-[0.7rem] uppercase tracking-wide text-slate-600 hover:bg-slate-50 min-w-[60px]"
                    >
                      {product.status ?? "-"}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none h-8 px-3 border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 gap-2 min-w-[60px]"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {movementsQuery.isLoading ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded" />
                ))}
              </div>
            ) : timeline.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-slate-500 h-full">
                <p className="text-sm font-medium text-slate-600">Belum ada mutasi tercatat</p>
                <p className="text-xs text-slate-400">
                  Catatan pergerakan barang akan tampil secara kronologis dengan saldo berjalan.
                </p>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-slate-100 text-[11px] uppercase tracking-[0.25rem] text-slate-500">
                      <th className="px-4 py-3 text-left font-medium border-b border-slate-200">Tanggal</th>
                      <th className="px-4 py-3 text-left font-medium border-b border-slate-200">Referensi</th>
                      <th className="px-4 py-3 text-left font-medium border-b border-slate-200">Sumber</th>
                      <th className="px-4 py-3 text-right font-medium border-b border-slate-200">Perubahan</th>
                      <th className="px-4 py-3 text-right font-medium border-b border-slate-200">Saldo</th>
                      <th className="px-4 py-3 text-left font-medium border-b border-slate-200">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeline.map((movement) => (
                      <tr
                        key={movement.id}
                        className="border-b border-slate-200/50 bg-white text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-sm">
                          {formatDateTime(movement.date)}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-[12px] uppercase tracking-wide text-slate-500">
                          {movement.referenceNo ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {movement.source}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold">
                          <span
                            className={movement.qtyChange >= 0 ? "text-emerald-600" : "text-rose-600"}
                          >
                            {movement.qtyChange >= 0 ? "+" : ""}
                            {numberFormatter.format(movement.qtyChange)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {numberFormatter.format(movement.runningQty)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {movement.note ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
