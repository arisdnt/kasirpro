import { useEffect, useMemo, useState } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useSystemConfigList } from "@/features/system-config/use-system-config";
import { SystemConfigHeader } from "./components/system-config-header";
import { SystemConfigList } from "./components/system-config-list";
import { SystemConfigDetail } from "./components/system-config-detail";
import { SystemConfigAddModal } from "./components/system-config-add-modal";
import { SystemConfigEditModal } from "./components/system-config-edit-modal";
import { SystemConfigDeleteDialog } from "./components/system-config-delete-dialog";
import { SystemConfigDetailModal } from "./components/system-config-detail-modal";

type ScopeFilter = "all" | "tenant" | string;
type TypeFilter = "all" | string;

export function SystemConfigPage() {
  const stores = useStoresQuery();
  const configsQuery = useSystemConfigList();

  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const configs = useMemo(() => configsQuery.data ?? [], [configsQuery.data]);

  useEffect(() => {
    if (!configs.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && configs.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(configs[0]?.id ?? null);
  }, [configs, selectedId]);

  const filteredConfigs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return configs.filter((config) => {
      const matchesSearch =
        query.length === 0 ||
        [config.key, config.tipe ?? "", config.deskripsi ?? "", config.tokoNama ?? ""]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (scopeFilter === "tenant" && config.tokoId) return false;
      if (scopeFilter !== "all" && scopeFilter !== "tenant" && config.tokoId !== scopeFilter) return false;
      if (typeFilter !== "all" && (config.tipe ?? "") !== typeFilter) return false;

      return true;
    });
  }, [configs, searchTerm, scopeFilter, typeFilter]);

  useEffect(() => {
    if (!filteredConfigs.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && filteredConfigs.some((config) => config.id === selectedId)) {
      return;
    }
    setSelectedId(filteredConfigs[0]?.id ?? null);
  }, [filteredConfigs, selectedId]);

  const selectedConfig = useMemo(
    () => filteredConfigs.find((config) => config.id === selectedId) ?? null,
    [filteredConfigs, selectedId],
  );

  const storeOptions = useMemo(
    () => (stores.data ?? []).map((store) => ({ value: store.id, label: store.nama })),
    [stores.data],
  );

  const detailModalConfig = useMemo(
    () => filteredConfigs.find((config) => config.id === detailModalId) ?? null,
    [detailModalId, filteredConfigs],
  );
  const editModalConfig = useMemo(
    () => filteredConfigs.find((config) => config.id === editModalId) ?? null,
    [editModalId, filteredConfigs],
  );
  const deleteModalConfig = useMemo(
    () => filteredConfigs.find((config) => config.id === deleteModalId) ?? null,
    [deleteModalId, filteredConfigs],
  );

  const typeOptions = useMemo(() => {
    const values = new Set(configs.map((config) => config.tipe ?? ""));
    values.delete("");
    return Array.from(values).sort();
  }, [configs]);

  const stats = useMemo(() => {
    const total = configs.length;
    const tenant = configs.filter((config) => !config.tokoId).length;
    const store = configs.filter((config) => config.tokoId).length;
    return { total, tenant, store };
  }, [configs]);

  const handleRefresh = () => {
    void configsQuery.refetch();
  };


  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <SystemConfigHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        scopeFilter={scopeFilter}
        onScopeFilterChange={setScopeFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        typeOptions={typeOptions}
        stores={stores}
        configsQuery={configsQuery}
        onRefresh={handleRefresh}
        stats={stats}
        onAddConfig={() => setIsAddOpen(true)}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <SystemConfigList
            filteredConfigs={filteredConfigs}
            selectedId={selectedId}
            onSelectConfig={setSelectedId}
            configsQuery={configsQuery}
            onViewDetail={(config) => setDetailModalId(config.id)}
            onEditConfig={(config) => setEditModalId(config.id)}
            onDeleteConfig={(config) => setDeleteModalId(config.id)}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <SystemConfigDetail
            selectedConfig={selectedConfig}
            onEdit={(config) => setEditModalId(config.id)}
            onDelete={(config) => setDeleteModalId(config.id)}
            onOpenModal={(config) => setDetailModalId(config.id)}
          />
        </div>
      </div>

      <SystemConfigAddModal
        open={isAddOpen}
        onOpenChange={(open) => setIsAddOpen(open)}
        storeOptions={storeOptions}
        defaultStoreId={scopeFilter !== "all" && scopeFilter !== "tenant" ? scopeFilter : null}
      />

      <SystemConfigEditModal
        open={Boolean(editModalId && editModalConfig)}
        onOpenChange={(open) => {
          if (!open) setEditModalId(null);
        }}
        config={editModalConfig}
        storeOptions={storeOptions}
      />

      <SystemConfigDeleteDialog
        open={Boolean(deleteModalId && deleteModalConfig)}
        onOpenChange={(open) => {
          if (!open) setDeleteModalId(null);
        }}
        config={deleteModalConfig}
      />

      <SystemConfigDetailModal
        open={Boolean(detailModalId && detailModalConfig)}
        onOpenChange={(open) => {
          if (!open) setDetailModalId(null);
        }}
        config={detailModalConfig}
        onEdit={(config) => setEditModalId(config.id)}
        onDelete={(config) => setDeleteModalId(config.id)}
      />
    </div>
  );
}
