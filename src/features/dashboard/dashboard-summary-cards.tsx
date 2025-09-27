import { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Skeleton,
} from "@heroui/react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type {
  DashboardFilters,
  DashboardInsights,
  DashboardSummary,
  SalesTrendPoint,
} from "@/features/dashboard/types";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
});

type Trend = {
  direction: "up" | "down" | "flat";
  percent: number;
};

type DashboardSummaryCardsProps = {
  summary: DashboardSummary | null | undefined;
  insights: DashboardInsights | null | undefined;
  filters: DashboardFilters;
  isLoadingSummary?: boolean;
  isLoadingInsights?: boolean;
};

const computeTrend = (
  points: SalesTrendPoint[] | undefined,
  selector: (point: SalesTrendPoint) => number,
): Trend => {
  if (!points || points.length < 2) {
    return { direction: "flat", percent: 0 };
  }

  const sorted = [...points].sort((a, b) => a.bucket.localeCompare(b.bucket));
  const latest = selector(sorted[sorted.length - 1]);
  const previous = selector(sorted[sorted.length - 2]);

  if (previous === 0) {
    if (latest === 0) {
      return { direction: "flat", percent: 0 };
    }
    return { direction: "up", percent: 100 };
  }

  const diff = ((latest - previous) / previous) * 100;
  if (Math.abs(diff) < 1) {
    return { direction: "flat", percent: Math.abs(diff) };
  }
  return {
    direction: diff > 0 ? "up" : "down",
    percent: Math.abs(diff),
  };
};

const TrendChip = ({ trend }: { trend: Trend }) => {
  if (trend.direction === "flat" || !Number.isFinite(trend.percent)) {
    return (
      <Chip
        size="sm"
        variant="flat"
        className="bg-slate-100 text-slate-600"
        startContent={<Minus className="h-3 w-3" />}
      >
        Stabil
      </Chip>
    );
  }

  const Icon = trend.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const color = trend.direction === "up" ? "success" : "danger";
  const label = `${trend.direction === "up" ? "+" : "-"}${trend.percent.toFixed(1)}%`;

  return (
    <Chip
      size="sm"
      variant="flat"
      color={color}
      startContent={<Icon className="h-3 w-3" />}
    >
      {label}
    </Chip>
  );
};

const formatRangeLabel = (filters: DashboardFilters) => {
  const start = dateFormatter.format(new Date(filters.startDate));
  const end = dateFormatter.format(new Date(filters.endDate));
  return `${start} – ${end}`;
};

const summarize = (insights: DashboardInsights | null | undefined) => {
  if (!insights) {
    return {
      totalRevenue: 0,
      totalTransactions: 0,
      averageTicket: 0,
      uniqueCustomers: 0,
      newCustomers: 0,
    };
  }

  const totalRevenue = insights.salesTrend.reduce(
    (acc, curr) => acc + curr.totalPenjualan,
    0,
  );
  const totalTransactions = insights.salesTrend.reduce(
    (acc, curr) => acc + curr.totalTransaksi,
    0,
  );
  const averageTicket =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  return {
    totalRevenue,
    totalTransactions,
    averageTicket,
    uniqueCustomers: insights.customerSummary.pelangganUnik ?? 0,
    newCustomers: insights.customerSummary.pelangganBaru ?? 0,
  };
};

export function DashboardSummaryCards({
  summary,
  insights,
  filters,
  isLoadingSummary,
  isLoadingInsights,
}: DashboardSummaryCardsProps) {
  const computed = useMemo(() => summarize(insights), [insights]);
  const revenueTrend = useMemo(
    () => computeTrend(insights?.salesTrend, (point) => point.totalPenjualan),
    [insights?.salesTrend],
  );
  const transactionTrend = useMemo(
    () => computeTrend(insights?.salesTrend, (point) => point.totalTransaksi),
    [insights?.salesTrend],
  );
  const customerTrend = useMemo(
    () => computeTrend(insights?.salesTrend, (point) => point.pelangganUnik),
    [insights?.salesTrend],
  );

  const isSummaryLoading = isLoadingSummary ?? false;
  const isInsightsLoading = isLoadingInsights ?? false;

  type CardDefinition = {
    id: string;
    title: string;
    primary: string;
    helper: string;
    description: string;
    trend?: Trend;
    loadingSource: "insights" | "summary" | "none";
  };

  const cards: CardDefinition[] = [
    {
      id: "period-revenue",
      title: "Pendapatan Periode",
      primary: formatCurrency(computed.totalRevenue),
      helper: `Rata-rata ${formatCurrency(computed.averageTicket)} per transaksi`,
      trend: revenueTrend,
      description: formatRangeLabel(filters),
      loadingSource: "insights",
    },
    {
      id: "today-revenue",
      title: "Penjualan Hari Ini",
      primary: formatCurrency(summary?.penjualanHariIni ?? 0),
      helper: `Bulan ini ${formatCurrency(summary?.penjualanBulanIni ?? 0)}`,
      trend: revenueTrend,
      description: shortDateFormatter.format(new Date()),
      loadingSource: "summary",
    },
    {
      id: "transactions",
      title: "Transaksi",
      primary: numberFormatter.format(computed.totalTransactions),
      helper: `Hari ini ${numberFormatter.format(
        summary?.transaksiHariIni ?? 0,
      )} • Bulan ini ${numberFormatter.format(
        summary?.transaksiBulanIni ?? 0,
      )}`,
      trend: transactionTrend,
      description: formatRangeLabel(filters),
      loadingSource: "insights",
    },
    {
      id: "customers",
      title: "Pelanggan",
      primary: numberFormatter.format(computed.uniqueCustomers),
      helper: `${numberFormatter.format(
        computed.newCustomers,
      )} pelanggan baru periode ini`,
      trend: customerTrend,
      description: "Aktivitas pelanggan",
      loadingSource: "insights",
    },
    {
      id: "inventory",
      title: "Status Persediaan",
      primary: `${numberFormatter.format(
        insights?.inventoryHealth.produkLow ?? 0,
      )} low • ${numberFormatter.format(
        insights?.inventoryHealth.produkHabis ?? 0,
      )} kosong`,
      helper: `${numberFormatter.format(
        insights?.inventoryHealth.produkAktif ?? 0,
      )} produk aktif`,
      description: "Kesehatan stok",
      loadingSource: "insights",
    },
    {
      id: "inventory-value",
      title: "Nilai Persediaan",
      primary: formatCurrency(insights?.inventoryHealth.nilaiPersediaan ?? 0),
      helper: "Estimasi nilai stok siap jual",
      description: "Perkiraan rupiah",
      loadingSource: "insights",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {cards.map((card) => {
        const isLoading =
          card.loadingSource === "insights"
            ? isInsightsLoading
            : card.loadingSource === "summary"
              ? isSummaryLoading
              : false;

        return (
        <Card
          key={card.id}
          className="border border-slate-200/70 bg-white/90 shadow-sm transition-all hover:shadow-lg"
        >
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">
                {card.title}
              </span>
              {card.trend ? <TrendChip trend={card.trend} /> : null}
            </div>
            <span className="text-xs text-slate-500">{card.description}</span>
          </CardHeader>
          <CardBody className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded-lg" />
            ) : (
              <span className="text-2xl font-semibold text-slate-900">
                {card.primary}
              </span>
            )}
            <p className="text-xs text-slate-500">{card.helper}</p>
          </CardBody>
        </Card>
        );
      })}
    </section>
  );
}
