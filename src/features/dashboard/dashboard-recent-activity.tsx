import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { ArrowUpRightSquare } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { RecentSale } from "@/types/dashboard";

type DashboardRecentActivityProps = {
  sales: RecentSale[];
  isLoading?: boolean;
};

export function DashboardRecentActivity({
  sales,
  isLoading,
}: DashboardRecentActivityProps) {
  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader className="flex items-center gap-2">
        <ArrowUpRightSquare className="h-5 w-5 text-sky-500" />
        <div>
          <p className="text-sm font-medium text-slate-700">
            Aktivitas Transaksi Terbaru
          </p>
          <p className="text-xs text-slate-500">
            Sorotan transaksi terakhir untuk memantau arus kas secara realtime.
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : sales.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Belum ada transaksi pada rentang waktu ini.
          </p>
        ) : (
          <ul className="space-y-2">
            {sales.map((sale) => (
              <li
                key={sale.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-700">
                    {sale.nomorTransaksi}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(sale.tanggal)} • {sale.pelanggan ?? "Tanpa pelanggan"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {formatCurrency(sale.total)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
