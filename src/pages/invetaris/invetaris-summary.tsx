import { Card, CardBody } from "@heroui/react";
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
    <Card className="shrink-0 shadow-sm rounded-none border border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
      <CardBody className="flex flex-col gap-2 py-3 px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {items.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 shadow-sm border border-slate-300 h-9">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-500 text-[9px] font-medium leading-none">{item.label}</span>
                  <span className="font-bold text-xs text-slate-800 leading-none mt-0.5">{numberFormatter.format(item.value)}</span>
                </div>
                {index < items.length - 1 && <div className="w-px h-6 bg-slate-300"></div>}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
