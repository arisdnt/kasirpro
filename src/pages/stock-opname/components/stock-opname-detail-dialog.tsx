import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { Badge } from "@/components/ui/badge";
import { formatDate, statusLabel, statusVariant, numberFormatter } from "../stock-opname-utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: StockOpnameSummary | null;
};

export default function StockOpnameDetailDialog({ open, onOpenChange, data }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Stock Opname</DialogTitle>
        </DialogHeader>
        {!data ? (
          <p className="text-sm text-slate-600">Memuat...</p>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Nomor</div>
                <div className="font-semibold">{data.nomorOpname}</div>
              </div>
              <Badge variant={statusVariant(data.status)} className="rounded">
                {statusLabel(data.status)}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-slate-500">Tanggal</div>
              <div className="font-medium">{formatDate(data.tanggal)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Toko</div>
                <div className="font-medium">{data.tokoNama ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">PJ</div>
                <div className="font-medium">{data.penggunaNama ?? '-'}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-500">Items</div>
                <div className="font-semibold">{data.totalItems}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Plus</div>
                <div className="font-semibold text-emerald-600">{numberFormatter.format(data.totalSelisihPlus)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Minus</div>
                <div className="font-semibold text-red-600">{numberFormatter.format(data.totalSelisihMinus)}</div>
              </div>
            </div>
            {data.catatan && (
              <div>
                <div className="text-xs text-slate-500">Catatan</div>
                <div className="text-slate-700">{data.catatan}</div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

