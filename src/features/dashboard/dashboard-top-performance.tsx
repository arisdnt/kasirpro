import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import { Trophy } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { TopCashier, TopProduct } from "@/types/dashboard";

const numberFormatter = new Intl.NumberFormat("id-ID");

const rankColors = ["bg-yellow-100 text-yellow-700", "bg-slate-100 text-slate-600", "bg-orange-100 text-orange-700"];

type DashboardTopPerformanceProps = {
  products: TopProduct[];
  cashiers: TopCashier[];
  isLoading?: boolean;
};

export function DashboardTopPerformance({
  products,
  cashiers,
  isLoading,
}: DashboardTopPerformanceProps) {
  const showProductEmpty = !isLoading && products.length === 0;
  const showCashierEmpty = !isLoading && cashiers.length === 0;

  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-slate-700">
            Performa Terbaik
          </p>
          <p className="text-xs text-slate-500">
            Lihat produk terlaris dan kasir dengan kontribusi terbesar.
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <Tabs aria-label="Top performer" variant="bordered" classNames={{ tabList: "bg-slate-50" }}>
          <Tab key="products" title="Produk">
            {isLoading ? (
              <div className="space-y-2 pt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : showProductEmpty ? (
              <div className="flex h-48 flex-col items-center justify-center text-sm text-slate-500">
                Belum ada penjualan produk pada periode ini.
              </div>
            ) : (
              <ul className="space-y-2 pt-4">
                {products.slice(0, 6).map((item, index) => (
                  <li
                    key={item.produkId}
                    className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${rankColors[index] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {item.namaProduk}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {numberFormatter.format(item.totalQty)} unit terjual
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-700">
                      {formatCurrency(item.totalPenjualan)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Tab>
          <Tab key="cashiers" title="Kasir">
            {isLoading ? (
              <div className="space-y-2 pt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : showCashierEmpty ? (
              <div className="flex h-48 flex-col items-center justify-center text-sm text-slate-500">
                Aktivitas kasir belum tercatat pada periode ini.
              </div>
            ) : (
              <ul className="space-y-2 pt-4">
                {cashiers.slice(0, 6).map((item, index) => (
                  <li
                    key={item.penggunaId}
                    className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="flat"
                        color={index === 0 ? "warning" : index === 1 ? "default" : "secondary"}
                        className="text-[11px]"
                      >
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {item.namaPengguna}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {numberFormatter.format(item.totalTransaksi)} transaksi
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-700">
                      {formatCurrency(item.totalPenjualan)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
