import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Package, Warehouse, AlertTriangle, Archive } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import {
  numberFormatter,
  summaryAccentMap,
  getStockState,
  type SummaryAccent
} from "./inventory-utils";

interface InventorySummaryCardProps {
  title: string;
  value: string;
  caption: string;
  icon: typeof Package;
  accent: SummaryAccent;
}

function InventorySummaryCard({
  title,
  value,
  caption,
  icon: Icon,
  accent,
}: InventorySummaryCardProps) {
  return (
    <Card className="border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", summaryAccentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface InventorySummaryProps {
  data: InventoryItem[];
}

export function InventorySummary({ data }: InventorySummaryProps) {
  const stats = useMemo(() => {
    const totalStock = data.reduce((acc, item) => acc + (item.stockFisik ?? 0), 0);
    const low = data.filter((item) => getStockState(item) === "low").length;
    const out = data.filter((item) => getStockState(item) === "out").length;
    const over = data.filter((item) => getStockState(item) === "over").length;

    return {
      totalItems: data.length,
      totalStock,
      low,
      out,
      over,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <InventorySummaryCard
        title="Item Terdaftar"
        value={numberFormatter.format(stats.totalItems)}
        caption="Jumlah SKU aktif pada inventaris"
        icon={Package}
        accent="slate"
      />
      <InventorySummaryCard
        title="Total Stok Fisik"
        value={numberFormatter.format(stats.totalStock)}
        caption="Akumulasi stok fisik di gudang"
        icon={Warehouse}
        accent="emerald"
      />
      <InventorySummaryCard
        title="Butuh Perhatian"
        value={numberFormatter.format(stats.low + stats.out)}
        caption="Item mendekati minimum atau kosong"
        icon={AlertTriangle}
        accent="amber"
      />
      <InventorySummaryCard
        title="Stok Berlebih"
        value={numberFormatter.format(stats.over)}
        caption="Item melebihi stok maksimum"
        icon={Archive}
        accent="sky"
      />
    </div>
  );
}