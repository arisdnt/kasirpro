import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useRecentSalesQuery } from "./use-dashboard-queries";

export function DashboardRecentSales() {
  const { data, isLoading } = useRecentSalesQuery();

  return (
    <Card className="border border-teal-200 bg-teal-50 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
          <CardTitle className="text-lg font-semibold text-teal-800">Transaksi Terbaru</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-md" />
          ))}
        {!isLoading && data && data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi. Mulai penjualan pertama Anda!
          </p>
        )}
        {data?.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/70 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{sale.nomorTransaksi}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(sale.tanggal)} • {sale.pelanggan ?? "Tanpa pelanggan"}
              </p>
            </div>
            <Badge variant="outline" className="rounded-full border-primary/20 bg-white/70 text-primary">
              {formatCurrency(sale.total)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
