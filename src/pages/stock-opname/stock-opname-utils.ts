import type { StockOpnameSummary } from "@/types/stock-opname";

export const numberFormatter = new Intl.NumberFormat("id-ID");
export const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
});

export function formatDate(value: string) {
  try {
    return dateFormatter.format(new Date(value));
  } catch (error) {
    console.error(error);
    return value;
  }
}

export function statusVariant(status: string | null) {
  switch (status) {
    case "draft":
      return "secondary" as const;
    case "selesai":
    case "final":
      return "outline" as const;
    case "dibatalkan":
    case "cancelled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export function statusLabel(status: string | null) {
  if (!status) return "Draft";
  switch (status) {
    case "draft":
      return "Draft";
    case "selesai":
      return "Selesai";
    case "final":
      return "Final";
    case "dibatalkan":
      return "Dibatalkan";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

export function summarizeOpnames(list: StockOpnameSummary[]) {
  return list.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.items += item.totalItems;
      acc.plus += item.totalSelisihPlus;
      acc.minus += item.totalSelisihMinus;
      return acc;
    },
    { total: 0, items: 0, plus: 0, minus: 0 },
  );
}

export function getVarianceColor(selisih: number): string {
  if (selisih === 0) return "text-slate-600";
  if (selisih > 0) return "text-emerald-600";
  return "text-rose-600";
}

export function formatVariance(selisih: number): string {
  return selisih > 0 ? `+${numberFormatter.format(selisih)}` : numberFormatter.format(selisih);
}