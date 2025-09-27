import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuditLogsQuery } from "@/features/audit/use-audit";
import { AuditFilters } from "./audit-filters";
import { AuditStatistics } from "./audit-statistics";
import { AuditTable } from "./audit-table";
import { AuditDetail } from "./audit-detail";

type ActionFilter = "all" | "INSERT" | "UPDATE" | "DELETE";

export function AuditPage() {
  const audits = useAuditLogsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <AuditFilters
              searchTerm={searchTerm}
              actionFilter={actionFilter}
              onSearchChange={setSearchTerm}
              onActionFilterChange={setActionFilter}
            />
            <AuditStatistics
              data={audits.data ?? []}
              onRefresh={handleRefresh}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <AuditTable
            data={filteredAudits}
            isLoading={audits.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <AuditDetail selectedAudit={selectedAudit} />
        </div>
      </div>
    </div>
  );
}