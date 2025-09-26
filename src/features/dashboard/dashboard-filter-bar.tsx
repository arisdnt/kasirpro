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
    <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="h-4 w-4" /> Filter Analitik
        </div>
        <Button
          size="sm"
          variant="light"
          startContent={<RefreshCcw className="h-4 w-4" />}
          onPress={onReset}
        >
          Reset Filter
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1.2fr]">
        <Select
          variant="flat"
          label="Toko"
          items={storeItems}
          selectedKeys={new Set([filters.tokoId])}
          onSelectionChange={handleStoreChange}
          startContent={<SlidersHorizontal className="h-4 w-4 text-slate-400" />}
          isLoading={isLoadingStores}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Select
          variant="flat"
          label="Status Transaksi"
          selectionMode="multiple"
          items={statusOptions}
          selectedKeys={new Set(filters.statuses)}
          onSelectionChange={handleStatusChange}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Tabs
          aria-label="Granularitas"
          selectedKey={filters.granularity}
          onSelectionChange={handleGranularityChange}
          variant="bordered"
          radius="lg"
          classNames={{
            tabList: "bg-slate-50",
          }}
        >
          <Tab key="day" title="Harian" />
          <Tab key="week" title="Mingguan" />
          <Tab key="month" title="Bulanan" />
        </Tabs>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CalendarDays className="h-4 w-4 text-slate-400" />
        {quickRanges.map((preset) => (
          <Button
            key={preset.key}
            size="sm"
            variant={currentPreset === preset.key ? "solid" : "light"}
            color={currentPreset === preset.key ? "primary" : "default"}
            onPress={() => handlePreset(preset.key)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
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
