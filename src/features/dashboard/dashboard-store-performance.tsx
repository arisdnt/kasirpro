import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { formatCurrency } from "@/lib/format";
import type { StorePerformance } from "@/types/dashboard";

const colors = ["#6366f1", "#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#14b8a6"];

const tooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/90 px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-slate-600">{item.tokoNama}</div>
      <div className="text-slate-500">{formatCurrency(item.totalPenjualan)}</div>
      <div className="text-slate-500">{item.totalTransaksi} transaksi</div>
    </div>
  );
};

type DashboardStorePerformanceProps = {
  data: StorePerformance[];
  isLoading?: boolean;
};

export function DashboardStorePerformance({ data, isLoading }: DashboardStorePerformanceProps) {
  const empty = !isLoading && data.length === 0;

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
      <CardBody className="h-[280px] p-0">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : empty ? (
          <div className="flex h-full flex-col items-center justify-center text-sm text-slate-500">
            Belum ada transaksi yang dapat dibandingkan.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 24, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="tokoNama"
                tick={{ fontSize: 11, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                tick={{ fontSize: 11, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={tooltip} />
              <Bar dataKey="totalPenjualan" radius={[8, 8, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.tokoId}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
