import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import type { StockOpnameSummary } from "@/types/stock-opname";
import { numberFormatter, formatDate, statusVariant, statusLabel } from "./stock-opname-utils";

interface StockOpnameListProps {
  data: StockOpnameSummary[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function StockOpnameList({ data, isLoading, selectedId, onSelectItem }: StockOpnameListProps) {
  return (
    <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Riwayat Opname</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm">Daftar Stock Opname</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} catatan
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-md" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
              <NotepadText className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Belum ada aktivitas stock opname</p>
              <p className="text-xs text-slate-500">
                Mulai sesi stock opname untuk memantau perbedaan stok fisik dan sistem.
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {data.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                      "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition",
                      isActive ? "border-indigo-300 bg-indigo-50/80" : "hover:border-indigo-200 hover:bg-indigo-50/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className={cn("text-sm font-semibold", isActive ? "text-indigo-700" : "text-slate-800")}>{item.nomorOpname}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(item.tanggal)} • {item.tokoNama ?? "-"}
                        </p>
                      </div>
                      <Badge variant={statusVariant(item.status)} className="rounded-full px-3 py-0.5 text-xs">
                        {statusLabel(item.status)}
                      </Badge>
                    </div>
                    {item.catatan ? (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.catatan}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                      <span>{item.totalItems} item</span>
                      <span>Selisih: {numberFormatter.format(item.totalSelisihNet)}</span>
                      <span>+</span>
                      <span className="text-emerald-600">{numberFormatter.format(item.totalSelisihPlus)}</span>
                      <span>-</span>
                      <span className="text-rose-600">{numberFormatter.format(item.totalSelisihMinus)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}