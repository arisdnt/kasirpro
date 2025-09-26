export type StockFilter = "all" | "positive" | "negative" | "zero";

export function getVarianceBadgeVariant(selisih: number) {
  if (selisih === 0) return "secondary";
  if (selisih > 0) return "outline";
  return "destructive";
}

export function formatVariance(selisih: number): string {
  return selisih > 0 ? `+${selisih}` : selisih.toString();
}

export function getVarianceColorClass(selisih: number): string {
  if (selisih === 0) return "text-slate-600";
  if (selisih > 0) return "text-emerald-600";
  return "text-red-600";
}

export function formatDate(value: string | null): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID");
  } catch {
    return "-";
  }
}