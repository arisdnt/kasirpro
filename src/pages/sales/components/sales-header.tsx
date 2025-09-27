import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { Filter, RefreshCw, Search } from "lucide-react";

type PaymentMethodFilter = "all" | "cash" | "card" | "transfer" | "qris";

interface SalesStats {
  total: number;
  totalRevenue: number;
  cash: number;
  nonCash: number;
}

interface SalesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentFilter: PaymentMethodFilter;
  onPaymentFilterChange: (value: PaymentMethodFilter) => void;
  stats: SalesStats;
  onRefresh: () => void;
}

export function SalesHeader({
  searchTerm,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
  stats,
  onRefresh,
}: SalesHeaderProps) {
  return (
    <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex flex-col gap-3 py-4 text-black">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[260px] flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nomor transaksi atau pelanggan"
                className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={paymentFilter}
                onChange={(event) => onPaymentFilterChange(event.target.value as PaymentMethodFilter)}
                className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua metode</option>
                <option value="cash">Tunai</option>
                <option value="card">Kartu</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-4 text-xs text-black bg-slate-50 px-3 py-1.5 rounded border h-10">
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-600 text-[10px] leading-none">Total</span>
                <span className="font-bold text-sm text-slate-900 leading-none">{stats.total}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-600 text-[10px] leading-none">Tunai</span>
                <span className="font-bold text-sm text-green-600 leading-none">{stats.cash}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-600 text-[10px] leading-none">Non-Tunai</span>
                <span className="font-bold text-sm text-blue-600 leading-none">{stats.nonCash}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-600 text-[10px] leading-none">Omzet</span>
                <span className="font-bold text-sm text-emerald-600 leading-none">{formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
            <Button onClick={onRefresh} className="gap-2 text-white rounded-none" style={{ backgroundColor: '#476EAE' }}>
              <RefreshCw className="h-4 w-4" />
              Refresh data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}