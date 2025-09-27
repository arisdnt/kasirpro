import { useEffect, useMemo, useState } from "react";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useSystemConfigList, useSystemConfigUpdate } from "@/features/system-config/use-system-config";
import type { SystemConfig } from "@/types/system-config";
import { SystemConfigMetrics } from "./components/system-config-metrics";
import { SystemConfigHeader } from "./components/system-config-header";
import { SystemConfigList } from "./components/system-config-list";
import { SystemConfigDetail } from "./components/system-config-detail";

type ScopeFilter = "all" | "tenant" | string;
type TypeFilter = "all" | string;

export function SystemConfigPage() {
  const stores = useStoresQuery();
  const configsQuery = useSystemConfigList();
  const updateMutation = useSystemConfigUpdate();

  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [valueDraft, setValueDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

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

  useEffect(() => {
    setValueDraft(selectedConfig?.value ?? "");
    setDescriptionDraft(selectedConfig?.deskripsi ?? "");
  }, [selectedConfig?.id, selectedConfig?.value, selectedConfig?.deskripsi]);

  const typeOptions = useMemo(() => {
    const values = new Set(configs.map((config) => config.tipe ?? ""));
    values.delete("");
    return Array.from(values).sort();
  }, [configs]);

  const handleRefresh = () => {
    void configsQuery.refetch();
  };

  const handleSave = () => {
    if (!selectedConfig) return;
    updateMutation.mutate({
      id: selectedConfig.id,
      value: valueDraft.trim().length === 0 ? null : valueDraft,
      deskripsi: descriptionDraft.trim().length === 0 ? null : descriptionDraft,
    });
  };

  const isDirty = Boolean(
    selectedConfig &&
      (((selectedConfig.value ?? "") !== valueDraft) || (selectedConfig.deskripsi ?? "") !== descriptionDraft),
  );

  const handleReset = () => {
    if (selectedConfig) {
      setValueDraft(selectedConfig.value ?? "");
      setDescriptionDraft(selectedConfig.deskripsi ?? "");
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <SystemConfigMetrics configs={configs} />

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
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <SystemConfigList
            filteredConfigs={filteredConfigs}
            selectedId={selectedId}
            onSelectConfig={setSelectedId}
            configsQuery={configsQuery}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <SystemConfigDetail
            selectedConfig={selectedConfig}
            valueDraft={valueDraft}
            onValueDraftChange={setValueDraft}
            descriptionDraft={descriptionDraft}
            onDescriptionDraftChange={setDescriptionDraft}
            isDirty={isDirty}
            isUpdating={updateMutation.isPending}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
