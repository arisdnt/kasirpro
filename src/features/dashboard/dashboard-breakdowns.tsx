import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import { formatCurrency } from "@/lib/format";
import type {
  CategoryPerformance,
  PaymentBreakdown,
} from "@/types/dashboard";

const numberFormatter = new Intl.NumberFormat("id-ID");

const categoryColors = [
  "#0ea5e9",
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#a855f7",
  "#facc15",
];

type DashboardBreakdownsProps = {
  categories: CategoryPerformance[];
  payments: PaymentBreakdown[];
  isLoading?: boolean;
};

type PaymentItem = { name?: string; value?: number };
const PaymentTooltip = ({ active, payload }: { active?: boolean; payload?: Array<PaymentItem> }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/90 px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-slate-600">{item.name}</div>
      <div className="text-slate-500">
        {formatCurrency(item.value ?? 0)}
      </div>
    </div>
  );
};

type CategoryItem = { payload?: { kategoriNama: string; totalPenjualan: number; totalQty: number } };
const CategoryTooltip = ({ active, payload }: { active?: boolean; payload?: Array<CategoryItem> }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const p = item?.payload ?? { kategoriNama: "", totalPenjualan: 0, totalQty: 0 };
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/90 px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-slate-600">{p.kategoriNama}</div>
      <div className="text-slate-500">
        {formatCurrency(p.totalPenjualan)} • {numberFormatter.format(p.totalQty)} produk
      </div>
    </div>
  );
};

export function DashboardBreakdowns({
  categories,
  payments,
  isLoading,
}: DashboardBreakdownsProps) {
  const showCategoryEmpty = !isLoading && categories.length === 0;
  const showPaymentEmpty = !isLoading && payments.length === 0;

  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader>
        <div>
          <p className="text-sm font-medium text-slate-700">
            Distribusi Penjualan
          </p>
          <p className="text-xs text-slate-500">
            Bandingkan kontribusi kategori produk dan metode pembayaran.
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <Tabs
          aria-label="Breakdown tabs"
          variant="bordered"
          classNames={{
            tabList: "bg-slate-50",
          }}
        >
          <Tab key="category" title="Kategori Produk">
            <div className="h-[260px] pt-4">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-lg" />
              ) : showCategoryEmpty ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
                  Tidak ada data kategori.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categories} layout="vertical" margin={{ left: 60, right: 24 }}>
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      dataKey="kategoriNama"
                      type="category"
                      tick={{ fontSize: 11, fill: "#475569" }}
                      width={120}
                    />
                    <Tooltip content={<CategoryTooltip />} />
                    <Bar dataKey="totalPenjualan" radius={[6, 6, 6, 6]} isAnimationActive={false} animationDuration={0} animationBegin={0}>
                      {categories.map((entry, index) => (
                        <Cell
                          key={entry.kategoriId}
                          fill={categoryColors[index % categoryColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Tab>
          <Tab key="payment" title="Metode Pembayaran">
            <div className="h-[260px] pt-4">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-lg" />
              ) : showPaymentEmpty ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
                  Belum ada transaksi pada rentang ini.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<PaymentTooltip />} />
                    <Pie
                      data={payments}
                      dataKey="totalPenjualan"
                      nameKey="metodePembayaran"
                      innerRadius={60}
                      paddingAngle={6}
                      cornerRadius={6}
                      isAnimationActive={false}
                      animationDuration={0}
                      animationBegin={0}
                    >
                      {payments.map((entry, index) => (
                        <Cell
                          key={entry.metodePembayaran}
                          fill={categoryColors[index % categoryColors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
