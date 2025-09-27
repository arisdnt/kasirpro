import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Settings2,
  Building,
  ShieldCheck,
} from "lucide-react";
import type { SystemConfig } from "@/features/system-config/types";

const numberFormatter = new Intl.NumberFormat("id-ID");

const summaryAccentMap = {
  indigo: "bg-indigo-100 text-indigo-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
} as const;
type SummaryAccent = keyof typeof summaryAccentMap;

type SummaryMetric = {
  title: string;
  value: string;
  caption: string;
  icon: typeof Settings2;
  accent: SummaryAccent;
};

function SummaryCard({ title, value, caption, icon: Icon, accent }: SummaryMetric) {
  return (
    <Card className="border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", summaryAccentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface SystemConfigMetricsProps {
  configs: SystemConfig[];
}

export function SystemConfigMetrics({ configs }: SystemConfigMetricsProps) {
  const total = configs.length;
  const storeScoped = configs.filter((config) => Boolean(config.tokoId)).length;
  const tenantScoped = total - storeScoped;
  const uniqueKeys = new Set(configs.map((config) => config.key)).size;

  const metrics: SummaryMetric[] = [
    {
      title: "Total Konfigurasi",
      value: numberFormatter.format(total),
      caption: `${uniqueKeys} key unik terdaftar`,
      icon: Settings2,
      accent: "indigo" as SummaryAccent,
    },
    {
      title: "Konfigurasi Toko",
      value: numberFormatter.format(storeScoped),
      caption: `${numberFormatter.format(tenantScoped)} konfigurasi tenant`,
      icon: Building,
      accent: "amber" as SummaryAccent,
    },
    {
      title: "Perlu Tinjau",
      value: numberFormatter.format(configs.filter((config) => (config.value ?? "").length === 0).length),
      caption: "Key tanpa nilai tersimpan",
      icon: ShieldCheck,
      accent: "emerald" as SummaryAccent,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <SummaryCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}