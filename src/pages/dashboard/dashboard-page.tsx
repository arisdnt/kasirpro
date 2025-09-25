import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { DashboardOverview } from "@/features/dashboard/dashboard-overview";
import { DashboardRecentSales } from "@/features/dashboard/dashboard-recent-sales";
import { DashboardLowStock } from "@/features/dashboard/dashboard-low-stock";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Pantau kondisi toko dan performa kasir secara realtime."
        actions={<Badge variant="secondary">Realtime Sync</Badge>}
      />
      <DashboardOverview />
      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardRecentSales />
        <DashboardLowStock />
      </section>
    </div>
  );
}
