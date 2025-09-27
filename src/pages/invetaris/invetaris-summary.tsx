import { Card, CardContent } from "@/components/ui/card";
import type { InventoryItem } from "@/features/inventory/types";
import type { SummaryAccent } from "./invetaris-utils";
import { numberFormatter, summaryAccentMap, getStockState } from "./invetaris-utils";

export function InvetarisSummary({ data }: { data: InventoryItem[] }) {
  const total = data.length;
  const out = data.filter((i) => getStockState(i) === "out").length;
  const low = data.filter((i) => getStockState(i) === "low").length;
  const over = data.filter((i) => getStockState(i) === "over").length;
  const healthy = total - out - low - over;

  const items: Array<{ label: string; value: number; accent: SummaryAccent }> = [
    { label: "Total Aset", value: total, accent: "slate" },
    { label: "Habis", value: out, accent: "rose" },
    { label: "Mendekati Minimum", value: low, accent: "amber" },
    { label: "Melebihi Maksimum", value: over, accent: "sky" },
    { label: "Sehat", value: healthy, accent: "emerald" },
  ];

  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-none border border-slate-200 bg-white px-3 py-2"
            >
              <div>
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-xl font-bold text-slate-800">{numberFormatter.format(item.value)}</div>
              </div>
              <div className={`rounded-full px-2 py-1 text-xs font-semibold ${summaryAccentMap[item.accent]}`}>
                {Math.round((item.value / Math.max(1, total)) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
