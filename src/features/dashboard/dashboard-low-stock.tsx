import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLowStockQuery } from "./use-dashboard-queries";

export function DashboardLowStock() {
  const { data, isLoading } = useLowStockQuery();

  return (
    <Card className="border border-amber-200 bg-amber-50 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <CardTitle className="text-lg font-semibold text-amber-800">Stok Menipis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-md" />
          ))}
        {!isLoading && data && data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Tidak ada produk yang menipis saat ini.
          </p>
        )}
        {data?.map((item) => (
          <div
            key={item.produkId}
            className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/70 px-3 py-2 text-sm shadow-sm"
          >
            <div>
              <p className="font-medium leading-none text-foreground">{item.namaProduk}</p>
              <p className="text-xs text-muted-foreground">{item.tokoNama}</p>
            </div>
            <div className="text-right text-xs">
              <div>Stok: {item.stockTersedia}</div>
              <div className="text-destructive">Minimal: {item.minimumStock}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
