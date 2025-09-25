import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSummaryQuery } from "./use-dashboard-queries";
import { formatCurrency } from "@/lib/format";

const summaryItems = [
  { key: "penjualanHariIni", label: "Penjualan Hari Ini", color: "emerald-50", iconColor: "text-emerald-600", borderColor: "border-emerald-200" },
  { key: "penjualanBulanIni", label: "Penjualan Bulan Ini", color: "blue-50", iconColor: "text-blue-600", borderColor: "border-blue-200" },
  { key: "transaksiHariIni", label: "Transaksi Hari Ini", isCount: true, color: "purple-50", iconColor: "text-purple-600", borderColor: "border-purple-200" },
  { key: "transaksiBulanIni", label: "Transaksi Bulan Ini", isCount: true, color: "indigo-50", iconColor: "text-indigo-600", borderColor: "border-indigo-200" },
  { key: "produkAktif", label: "Produk Aktif", isCount: true, color: "orange-50", iconColor: "text-orange-600", borderColor: "border-orange-200" },
  { key: "produkMenipis", label: "Produk Menipis", isCount: true, color: "rose-50", iconColor: "text-rose-600", borderColor: "border-rose-200" },
] as const;

export function DashboardOverview() {
  const { data, isLoading } = useDashboardSummaryQuery();

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.key} className={`${item.borderColor} bg-${item.color} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}>
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-slate-800">
                {item.label}
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${item.iconColor.replace('text-', 'bg-')}`}></div>
            </div>
            <p className="text-xs text-slate-600">
              {data?.tokoNama ? `Toko ${data.tokoNama}` : "Semua toko"}
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <Skeleton className="h-10 w-28 rounded-md" />
            ) : (
              <p className={`text-2xl font-bold tracking-tight ${item.iconColor}`}>
                {(() => {
                  const raw = data?.[item.key as keyof typeof data] as number | undefined;
                  const value = raw ?? 0;
                  const isCount = (item as { isCount?: boolean }).isCount;
                  return isCount
                    ? value.toLocaleString("id-ID")
                    : formatCurrency(value);
                })()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
