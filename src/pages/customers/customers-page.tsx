import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomersQuery } from "@/features/customers/use-customers";
import { CustomersFilters } from "./customers-filters";
import { CustomersStatistics } from "./customers-statistics";
import { CustomersTable } from "./customers-table";
import { CustomersDetail } from "./customers-detail";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function CustomersPage() {
  const customers = useCustomersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const data = customers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.telepon ?? "").toLowerCase().includes(query) ||
          (item.email ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [customers.data, searchTerm, statusFilter]);

  const selectedCustomer = useMemo(() => {
    if (!selectedId) return null;
    return filteredCustomers.find((item) => item.id === selectedId) ?? null;
  }, [filteredCustomers, selectedId]);

  const handleRefresh = () => {
    customers.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <CustomersFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
            />
            <CustomersStatistics
              data={customers.data ?? []}
              onRefresh={handleRefresh}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <CustomersTable
          data={filteredCustomers}
          isLoading={customers.isLoading}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
        />
        <CustomersDetail selectedCustomer={selectedCustomer} />
      </div>
    </div>
  );
}