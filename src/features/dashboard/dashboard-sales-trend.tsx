import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/format";
import type { DashboardFilters, SalesTrendPoint } from "@/types/dashboard";
import { memo } from "react";

const numberFormatter = new Intl.NumberFormat("id-ID");

type DashboardSalesTrendProps = {
  data: SalesTrendPoint[];
  isLoading?: boolean;
  granularity: DashboardFilters["granularity"];
};

const formatTick = (bucket: string, granularity: DashboardFilters["granularity"]) => {
  const parsed = new Date(bucket);
  if (Number.isNaN(parsed.getTime())) return bucket;
  switch (granularity) {
    case "month":
      return format(parsed, "MMM yyyy");
    case "week":
      return format(parsed, "dd MMM");
    default:
      return format(parsed, "dd MMM");
  }
};

const metricColors = {
  revenue: "#0ea5e9",
  transactions: "#818cf8",
  customers: "#22c55e",
};

const TrendTooltip = ({
  active,
  payload,
  label,
  granularity,
}: {
  active?: boolean;
  payload?: Array<{
    color: string;
    value: number;
    name: string;
    payload?: SalesTrendPoint;
  }>;
  label?: string | number;
  granularity: DashboardFilters["granularity"];
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const labelText = label == null ? "" : String(label);

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white/95 p-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500">
        {formatTick(labelText, granularity)}
      </p>
      <ul className="mt-2 space-y-1 text-xs">
        {payload.map((item: {
          color: string;
          value: number;
          name: string;
          payload?: SalesTrendPoint;
        }) => {
          const isRevenue = item.name === "Pendapatan";
          const value = isRevenue
            ? formatCurrency(item.value ?? 0)
            : numberFormatter.format(item.value ?? 0);
          return (
            <li key={item.name} className="flex items-center gap-2">
              <span
                className="inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-600">{item.name}</span>
              <span className="ml-auto text-slate-700">{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

function DashboardSalesTrendImpl({
  data,
  isLoading,
  granularity,
}: DashboardSalesTrendProps) {
  const showEmptyState = !isLoading && data.length === 0;

  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Tren Penjualan & Aktivitas
          </p>
          <p className="text-xs text-slate-500">
            Pendapatan, jumlah transaksi, dan pelanggan unik berdasarkan
            granularitas {granularity === "day" ? "harian" : granularity === "week" ? "mingguan" : "bulanan"}.
          </p>
        </div>
      </CardHeader>
      <CardBody className="h-[320px] p-0">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : showEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
            <span>Tidak ada data pada rentang ini.</span>
            <span>Coba ubah filter tanggal atau toko.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 32, bottom: 20, left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="bucket"
                tickFormatter={(value) => formatTick(value, granularity)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : `${value}`
                }
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => numberFormatter.format(value)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
              />
              <Tooltip
                content={(props) => (
                  <TrendTooltip
                    {...(props as {
                      active?: boolean;
                      payload?: Array<{
                        color: string;
                        value: number;
                        name: string;
                        payload?: SalesTrendPoint;
                      }>;
                      label?: string | number;
                    })}
                    granularity={granularity}
                  />
                )}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#475569" }}
                formatter={(value) => value}
              />
              <Area
                type="monotone"
                dataKey="totalPenjualan"
                name="Pendapatan"
                yAxisId="left"
                stroke={metricColors.revenue}
                fill={metricColors.revenue}
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                animationDuration={0}
                animationBegin={0}
              />
              <Bar
                dataKey="totalTransaksi"
                name="Transaksi"
                yAxisId="right"
                fill={metricColors.transactions}
                barSize={22}
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
                animationDuration={0}
                animationBegin={0}
              />
              <Line
                type="monotone"
                dataKey="pelangganUnik"
                name="Pelanggan Unik"
                yAxisId="right"
                stroke={metricColors.customers}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                animationDuration={0}
                animationBegin={0}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}

export const DashboardSalesTrend = memo(DashboardSalesTrendImpl);
