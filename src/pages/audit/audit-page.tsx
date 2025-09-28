import { useState, useMemo } from "react";
import { useAuditLogsQuery } from "@/features/audit/use-audit";
import { AuditFilters } from "./audit-filters";
import { AuditTable } from "./audit-table";
import { AuditDetail } from "./audit-detail";

type ActionFilter = "all" | "INSERT" | "UPDATE" | "DELETE";

export function AuditPage() {
  const audits = useAuditLogsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = audits.data ?? [];
    const total = data.length;
    const insert = data.filter((item) => item.aksi === "INSERT").length;
    const update = data.filter((item) => item.aksi === "UPDATE").length;
    const deleteCount = data.filter((item) => item.aksi === "DELETE").length;
    return { total, insert, update, delete: deleteCount };
  }, [audits.data]);

  const filteredAudits = useMemo(() => {
    const data = audits.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.tabel.toLowerCase().includes(query) ||
          (item.userId ?? "").toLowerCase().includes(query);
        const matchesAction =
          actionFilter === "all" ||
          item.aksi === actionFilter;
        return matchesSearch && matchesAction;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [audits.data, searchTerm, actionFilter]);

  const selectedAudit = useMemo(() => {
    if (!selectedId) return null;
    return filteredAudits.find((item) => item.id === selectedId) ?? null;
  }, [filteredAudits, selectedId]);

  const handleRefresh = () => {
    audits.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <AuditFilters
        searchTerm={searchTerm}
        actionFilter={actionFilter}
        stats={stats}
        onSearchChange={setSearchTerm}
        onActionFilterChange={setActionFilter}
        onRefresh={handleRefresh}
        isRefreshing={audits.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <AuditTable
            data={filteredAudits}
            isLoading={audits.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <AuditDetail selectedAudit={selectedAudit} />
        </div>
      </div>
    </div>
  );
}