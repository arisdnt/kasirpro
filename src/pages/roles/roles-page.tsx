import { useState, useMemo } from "react";
import { useRolesQuery } from "@/features/roles/use-roles";
import { RolesHeader } from "./components/roles-header";
import { RolesTable } from "./components/roles-table";
import { RoleDetails } from "./components/role-details";

type StatusFilter = "all" | "active" | "inactive";

export function RolesPage() {
  const roles = useRolesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = roles.data ?? [];
    const total = data.length;
    const active = data.filter((item) => item.isActive).length;
    const inactive = data.filter((item) => !item.isActive).length;
    const totalUsers = data.reduce((sum, item) => sum + item.userCount, 0);
    return { total, active, inactive, totalUsers };
  }, [roles.data]);

  const filteredRoles = useMemo(() => {
    const data = roles.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.deskripsi ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && item.isActive) ||
          (statusFilter === "inactive" && !item.isActive);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.level - b.level);
  }, [roles.data, searchTerm, statusFilter]);

  const selectedRole = useMemo(() => {
    if (!selectedId) return null;
    return filteredRoles.find((item) => item.id === selectedId) ?? null;
  }, [filteredRoles, selectedId]);

  const handleRefresh = () => {
    roles.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <RolesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        onRefresh={handleRefresh}
        isRefreshing={roles.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <RolesTable
            roles={filteredRoles}
            isLoading={roles.isLoading}
            selectedId={selectedId}
            onSelectRole={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <RoleDetails role={selectedRole} />
        </div>
      </div>
    </div>
  );
}