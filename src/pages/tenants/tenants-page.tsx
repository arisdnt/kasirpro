import { useState, useMemo } from "react";
import { useTenantsQuery } from "@/features/tenants/use-tenants";
import { TenantsHeader } from "./components/tenants-header";
import { TenantsTable } from "./components/tenants-table";
import { TenantDetails } from "./components/tenant-details";

type StatusFilter = "all" | "aktif" | "nonaktif" | "suspended";

export function TenantsPage() {
  const tenants = useTenantsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = tenants.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = data.filter((item) => item.status === "nonaktif").length;
    const suspended = data.filter((item) => item.status === "suspended").length;
    return { total, aktif, nonaktif, suspended };
  }, [tenants.data]);

  const filteredTenants = useMemo(() => {
    const data = tenants.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.alamat ?? "").toLowerCase().includes(query) ||
          (item.email ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [tenants.data, searchTerm, statusFilter]);

  const selectedTenant = useMemo(() => {
    if (!selectedId) return null;
    return filteredTenants.find((item) => item.id === selectedId) ?? null;
  }, [filteredTenants, selectedId]);

  const handleRefresh = () => {
    tenants.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <TenantsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        tenants={tenants}
        onRefresh={handleRefresh}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <TenantsTable
            filteredTenants={filteredTenants}
            selectedId={selectedId}
            onSelectTenant={setSelectedId}
            tenants={tenants}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <TenantDetails selectedTenant={selectedTenant} />
        </div>
      </div>
    </div>
  );
}