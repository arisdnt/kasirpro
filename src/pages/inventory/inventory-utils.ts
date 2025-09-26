import type { InventoryItem } from "@/types/inventory";

export type StockStateFilter = "all" | "low" | "out" | "over" | "healthy";

export type SummaryAccent = "sky" | "amber" | "rose" | "emerald" | "slate";

export const numberFormatter = new Intl.NumberFormat("id-ID");
export const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export const summaryAccentMap = {
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-700",
} as const;

export function getStockState(item: InventoryItem): StockStateFilter {
  if (item.stockFisik <= 0) return "out";
  if (item.stockMinimum != null && item.stockFisik <= item.stockMinimum) return "low";
  if (item.stockMaximum != null && item.stockFisik > item.stockMaximum) return "over";
  return "healthy";
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  try {
    return dateFormatter.format(new Date(value));
  } catch (error) {
    console.error(error);
    return value;
  }
}

export function getStockStateBadgeVariant(state: StockStateFilter) {
  switch (state) {
    case "out":
      return "destructive";
    case "low":
      return "secondary";
    case "over":
      return "outline";
    default:
      return "secondary";
  }
}

export function getStockStateLabel(state: StockStateFilter) {
  switch (state) {
    case "healthy":
      return "Sehat";
    case "low":
      return "Mendekati minimum";
    case "out":
      return "Stok habis";
    case "over":
      return "Melebihi maksimum";
    default:
      return "-";
  }
}