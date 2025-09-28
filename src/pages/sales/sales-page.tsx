import { useState, useMemo, useEffect } from "react";
import { useSalesQuery, useSaleItemsQuery } from "@/features/sales/use-sales";
import { SalesHeader } from "./components/sales-header";
import { SalesTable } from "./components/sales-table";
import { SaleInvoice } from "./components/sale-invoice";
import { useRealtimeDebug, useRealtimeConnectionTest } from "@/hooks/use-realtime-debug";
import { setupRealtimeTestFunctions } from "@/utils/realtime-test";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

type PaymentMethodFilter = "all" | "cash" | "card" | "transfer" | "qris";

export function SalesPage() {
  const { state: { user } } = useSupabaseAuth();
  const sales = useSalesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const saleItems = useSaleItemsQuery(selectedId);

  // Debug hooks untuk development
  useRealtimeDebug();
  useRealtimeConnectionTest();

  // Setup test functions
  useEffect(() => {
    if (user?.tenantId) {
      setupRealtimeTestFunctions(user.tenantId, user.tokoId);
    }
  }, [user?.tenantId, user?.tokoId]);

  const stats = useMemo(() => {
    const data = sales.data ?? [];
    const total = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
    const cash = data.filter((item) => item.metodePembayaran === "cash").length;
    const nonCash = total - cash;
    return { total, totalRevenue, cash, nonCash };
  }, [sales.data]);

  const filteredSales = useMemo(() => {
    const data = sales.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorTransaksi.toLowerCase().includes(query) ||
          (item.pelangganNama ?? "").toLowerCase().includes(query);
        const matchesPayment =
          paymentFilter === "all" ||
          item.metodePembayaran === paymentFilter;
        return matchesSearch && matchesPayment;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [sales.data, searchTerm, paymentFilter]);

  const selectedSale = useMemo(() => {
    if (!selectedId) return null;
    return filteredSales.find((item) => item.id === selectedId) ?? null;
  }, [filteredSales, selectedId]);

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    sales.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <SalesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        stats={stats}
        onRefresh={handleRefresh}
        isLoading={sales.isLoading || sales.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <SalesTable
            sales={filteredSales}
            isLoading={sales.isLoading}
            selectedId={selectedId}
            onSelectSale={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <SaleInvoice
            sale={selectedSale}
            saleItems={{ data: saleItems.data, isLoading: saleItems.isLoading }}
          />
        </div>
      </div>
    </div>
  );
}