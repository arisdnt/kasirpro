import { memo, useMemo } from "react";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { formatCurrency } from "@/lib/format";
import type { StorePerformance } from "@/types/dashboard";

type DashboardStorePerformanceProps = {
  data: StorePerformance[];
  isLoading?: boolean;
};

function DashboardStorePerformanceImpl({ data, isLoading }: DashboardStorePerformanceProps) {
  const empty = !isLoading && data.length === 0;

  const { sortedStores, topStore, totalPenjualan } = useMemo(() => {
    if (data.length === 0) {
      return { sortedStores: [] as StorePerformance[], topStore: undefined, totalPenjualan: 0 };
    }

    const sorted = [...data].sort((a, b) => b.totalPenjualan - a.totalPenjualan);
    const total = sorted.reduce((acc, item) => acc + item.totalPenjualan, 0);

    return { sortedStores: sorted, topStore: sorted[0], totalPenjualan: total };
  }, [data]);

  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader>
        <div>
          <p className="text-sm font-medium text-slate-700">Perbandingan Toko</p>
          <p className="text-xs text-slate-500">
            Monitor kontribusi penjualan antar cabang untuk melihat kinerja terbaik.
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-none" />
        ) : empty ? (
          <div className="flex h-[280px] flex-col items-center justify-center px-6 text-center text-sm text-slate-500">
            Belum ada transaksi yang dapat dibandingkan.
          </div>
        ) : (
          <div className="flex h-[280px] flex-col">
            {topStore ? (
              <div className="border-b border-slate-200/70 bg-slate-50/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Toko Teratas
                </p>
                <div className="mt-1 text-sm font-semibold text-slate-700">{topStore.tokoNama}</div>
                <p className="text-xs text-slate-500">
                  {formatCurrency(topStore.totalPenjualan)} · {topStore.totalTransaksi} transaksi · Rata order {formatCurrency(topStore.rataOrder)}
                </p>
              </div>
            ) : null}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
              {sortedStores.map((store, index) => {
                const share = totalPenjualan === 0 ? 0 : (store.totalPenjualan / totalPenjualan) * 100;
                const contribution = Math.round(share);
                const barWidth = totalPenjualan === 0 ? 0 : Math.min(Math.max(share, contribution > 0 ? 6 : 0), 100);

                return (
                  <div key={store.tokoId} className="rounded-lg border border-slate-200/80 bg-white/95 p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {index + 1}. {store.tokoNama}
                        </p>
                        <p className="text-xs text-slate-500">
                          {store.totalTransaksi} transaksi · Rata order {formatCurrency(store.rataOrder)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{formatCurrency(store.totalPenjualan)}</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200/80">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Kontribusi {contribution}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export const DashboardStorePerformance = memo(DashboardStorePerformanceImpl);
