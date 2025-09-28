import { useState, useMemo } from "react";
import { useUsersQuery } from "@/features/users/use-users";
import { UsersHeader } from "./components/users-header";
import { UsersTable } from "./components/users-table";
import { UserDetails } from "./components/user-details";

type StatusFilter = "all" | "aktif" | "nonaktif" | "suspended" | "cuti";

export function UsersPage() {
  const users = useUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = users.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = data.filter((item) => item.status === "nonaktif").length;
    const suspended = data.filter((item) => item.status === "suspended").length;
    const cuti = data.filter((item) => item.status === "cuti").length;
    return { total, aktif, nonaktif, suspended, cuti };
  }, [users.data]);

  const filteredUsers = useMemo(() => {
    const data = users.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.username.toLowerCase().includes(query) ||
          (item.fullName ?? "").toLowerCase().includes(query) ||
          (item.email ?? "").toLowerCase().includes(query) ||
          (item.roleName ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [users.data, searchTerm, statusFilter]);

  const selectedUser = useMemo(() => {
    if (!selectedId) return null;
    return filteredUsers.find((item) => item.id === selectedId) ?? null;
  }, [filteredUsers, selectedId]);

  const handleRefresh = () => {
    users.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <UsersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        onRefresh={handleRefresh}
        isRefreshing={users.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <UsersTable
            users={filteredUsers}
            isLoading={users.isLoading}
            selectedId={selectedId}
            onSelectUser={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <UserDetails user={selectedUser} />
        </div>
      </div>
    </div>
  );
}