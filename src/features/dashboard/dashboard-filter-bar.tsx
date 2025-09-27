import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import {
  CalendarDays,
  Filter,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  differenceInCalendarDays,
  format,
  isSameDay,
  parseISO,
  startOfYear,
  subDays,
} from "date-fns";
import type { Selection } from "@react-types/shared";
import type {
  DashboardFilters,
  TransactionStatus,
} from "@/types/dashboard";
import type { Toko } from "@/types/management";

const statusOptions: Array<{ value: TransactionStatus; label: string }> = [
  { value: "selesai", label: "Selesai" },
  { value: "diterima", label: "Diterima" },
  { value: "sebagian", label: "Sebagian" },
  { value: "draft", label: "Draft" },
  { value: "batal", label: "Batal" },
];

type PresetKey = "7d" | "30d" | "90d" | "ytd" | "custom";

const quickRanges: Array<{ key: PresetKey; label: string; description: string }> = [
  { key: "7d", label: "7 Hari", description: "Rentang 7 hari terakhir" },
  { key: "30d", label: "30 Hari", description: "Rentang 30 hari terakhir" },
  { key: "90d", label: "90 Hari", description: "Rentang 90 hari terakhir" },
  { key: "ytd", label: "YTD", description: "Sejak awal tahun" },
  { key: "custom", label: "Kustom", description: "Atur manual rentang tanggal" },
];

type DashboardFilterBarProps = {
  filters: DashboardFilters;
  stores: Toko[] | undefined;
  isLoadingStores?: boolean;
  onFiltersChange: (next: DashboardFilters) => void;
  onReset: () => void;
};

export function DashboardFilterBar({
  filters,
  stores,
  isLoadingStores,
  onFiltersChange,
  onReset,
}: DashboardFilterBarProps) {
  const [isCustomRangeOpen, setCustomRangeOpen] = useState(false);
  const [tempStart, setTempStart] = useState(filters.startDate);
  const [tempEnd, setTempEnd] = useState(filters.endDate);

  const storeItems = useMemo(
    () => [
      { value: "all", label: "Semua Toko" },
      ...(stores ?? []).map((store) => ({ value: store.id, label: store.nama })),
    ],
    [stores],
  );

  const updateFilters = useCallback(
    (patch: Partial<DashboardFilters>) => {
      onFiltersChange({ ...filters, ...patch });
    },
    [filters, onFiltersChange],
  );

  const currentPreset = useMemo<PresetKey>(() => {
    const start = parseISO(filters.startDate);
    const end = parseISO(filters.endDate);
    const diff = differenceInCalendarDays(end, start);

    if (diff === 6) return "7d";
    if (diff === 29) return "30d";
    if (diff === 89) return "90d";
    if (isSameDay(start, startOfYear(end))) return "ytd";
    return "custom";
  }, [filters.startDate, filters.endDate]);

  const handlePreset = (key: PresetKey) => {
    if (key === "custom") {
      setTempStart(filters.startDate);
      setTempEnd(filters.endDate);
      setCustomRangeOpen(true);
      return;
    }

    const today = new Date();
    let start = today;

    if (key === "7d") {
      start = subDays(today, 6);
    } else if (key === "30d") {
      start = subDays(today, 29);
    } else if (key === "90d") {
      start = subDays(today, 89);
    } else if (key === "ytd") {
      start = startOfYear(today);
    }

    updateFilters({
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(today, "yyyy-MM-dd"),
    });
  };

  const handleStoreChange = (keys: Selection) => {
    const value =
      keys === "all" ? "all" : (Array.from(keys)[0] as string | undefined);
    updateFilters({ tokoId: value ?? "all" });
  };

  const handleStatusChange = (keys: Selection) => {
    if (keys === "all") {
      updateFilters({
        statuses: statusOptions.map((option) => option.value),
      });
      return;
    }
    const values = Array.from(keys).map((key) =>
      key.toString(),
    ) as TransactionStatus[];
    updateFilters({ statuses: values });
  };

  const handleGranularityChange = (key: string | number) => {
    updateFilters({ granularity: key as DashboardFilters["granularity"] });
  };

  const handleCustomSubmit = () => {
    const startDate = tempStart <= tempEnd ? tempStart : tempEnd;
    const endDate = tempEnd >= tempStart ? tempEnd : tempStart;
    updateFilters({ startDate, endDate });
    setCustomRangeOpen(false);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header with title and reset button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <Filter className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Filter Analitik</h3>
            <p className="text-xs text-gray-500">Atur parameter untuk analisis data</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="light"
          startContent={<RefreshCcw className="h-4 w-4" />}
          onPress={onReset}
          className="text-gray-600 hover:text-gray-900"
        >
          Reset
        </Button>
      </div>

      {/* Single row layout for all filters */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_180px_160px_1fr_120px] gap-4 items-end">
        {/* Store Selection */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Toko</label>
          <Select
            variant="bordered"
            placeholder="Pilih toko"
            items={storeItems}
            selectedKeys={new Set([filters.tokoId])}
            onSelectionChange={handleStoreChange}
            startContent={<SlidersHorizontal className="h-4 w-4 text-gray-400" />}
            isLoading={isLoadingStores}
            classNames={{
              trigger: "h-10 bg-white border-gray-200 hover:border-gray-300",
              value: "text-sm",
            }}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>

        {/* Status Selection */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Status</label>
          <Select
            variant="bordered"
            placeholder="Pilih status"
            selectionMode="multiple"
            items={statusOptions}
            selectedKeys={new Set(filters.statuses)}
            onSelectionChange={handleStatusChange}
            classNames={{
              trigger: "h-10 bg-white border-gray-200 hover:border-gray-300",
              value: "text-sm",
            }}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>

        {/* Granularity Tabs */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Periode</label>
          <Tabs
            aria-label="Granularitas"
            selectedKey={filters.granularity}
            onSelectionChange={handleGranularityChange}
            variant="light"
            radius="md"
            size="sm"
            classNames={{
              tabList: "bg-gray-50 border border-gray-200 h-10",
              tab: "h-8 text-xs",
              cursor: "bg-white shadow-sm",
            }}
          >
            <Tab key="day" title="Hari" />
            <Tab key="week" title="Minggu" />
            <Tab key="month" title="Bulan" />
          </Tabs>
        </div>

        {/* Date Range Presets */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Rentang Waktu</label>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-gray-400 mr-1" />
            <div className="flex flex-wrap gap-1">
              {quickRanges.map((preset) => (
                <Button
                  key={preset.key}
                  size="sm"
                  variant={currentPreset === preset.key ? "solid" : "light"}
                  color={currentPreset === preset.key ? "primary" : "default"}
                  onPress={() => handlePreset(preset.key)}
                  className={`h-8 px-2 text-xs min-w-0 ${
                    currentPreset === preset.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-transparent">Action</label>
          <Button
            color="primary"
            variant="solid"
            size="sm"
            className="h-10 w-full bg-blue-600 hover:bg-blue-700"
          >
            Terapkan
          </Button>
        </div>
      </div>

      <Modal isOpen={isCustomRangeOpen} onOpenChange={setCustomRangeOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tentukan Rentang Waktu
                <span className="text-xs font-normal text-slate-500">
                  Gunakan format tanggal untuk memfokuskan analitik.
                </span>
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="Tanggal Mulai"
                  type="date"
                  value={tempStart}
                  onChange={(event) => setTempStart(event.target.value)}
                  variant="flat"
                />
                <Input
                  label="Tanggal Selesai"
                  type="date"
                  value={tempEnd}
                  onChange={(event) => setTempEnd(event.target.value)}
                  variant="flat"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Batalkan
                </Button>
                <Button color="primary" onPress={handleCustomSubmit}>
                  Terapkan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
