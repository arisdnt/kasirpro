import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useInventoryQuery } from "@/features/inventory/use-inventory";
import type { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Archive,
  Box,
  BoxSelect,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Warehouse,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });
const summaryAccentMap = {
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-700",
} as const;
type SummaryAccent = keyof typeof summaryAccentMap;

type StockStateFilter = "all" | "low" | "out" | "over" | "healthy";

function getStockState(item: InventoryItem): StockStateFilter {
  if (item.stockFisik <= 0) return "out";
  if (item.stockMinimum != null && item.stockFisik <= item.stockMinimum) return "low";
  if (item.stockMaximum != null && item.stockFisik > item.stockMaximum) return "over";
  return "healthy";
}

function formatDate(value: string | null) {
  if (!value) return "-";
  try {
    return dateFormatter.format(new Date(value));
  } catch (error) {
    console.error(error);
    return value;
  }
}

function InventorySummaryCard({
  title,
  value,
  caption,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof Box;
  accent: SummaryAccent;
}) {
  return (
    <Card className="border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", summaryAccentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function InventoryPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockState, setStockState] = useState<StockStateFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inventory = useInventoryQuery(storeFilter);

  useEffect(() => {
    if (!inventory.data || inventory.data.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && inventory.data.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(inventory.data[0]?.id ?? null);
  }, [inventory.data, selectedId]);

  const filteredInventory = useMemo(() => {
    const data = inventory.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        [item.produkNama, item.produkKode ?? "", item.lokasiRak ?? ""].some((value) =>
          value.toLowerCase().includes(query),
        );

      if (!matchesSearch) return false;

      if (stockState === "all") return true;
      const state = getStockState(item);
      if (stockState === "healthy") {
        return state === "healthy";
      }
      return state === stockState;
    });
  }, [inventory.data, searchTerm, stockState]);

  const stats = useMemo(() => {
    const data = inventory.data ?? [];
    const totalStock = data.reduce((acc, item) => acc + (item.stockFisik ?? 0), 0);
    const low = data.filter((item) => getStockState(item) === "low").length;
    const out = data.filter((item) => getStockState(item) === "out").length;
    const over = data.filter((item) => getStockState(item) === "over").length;

    return {
      totalItems: data.length,
      totalStock,
      low,
      out,
      over,
    };
  }, [inventory.data]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredInventory.find((item) => item.id === selectedId) ?? null;
  }, [filteredInventory, selectedId]);

  const handleRefresh = () => {
    void inventory.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InventorySummaryCard
          title="Item Terdaftar"
          value={numberFormatter.format(stats.totalItems)}
          caption="Jumlah SKU aktif pada inventaris"
          icon={Package}
          accent="slate"
        />
        <InventorySummaryCard
          title="Total Stok Fisik"
          value={numberFormatter.format(stats.totalStock)}
          caption="Akumulasi stok fisik di gudang"
          icon={Warehouse}
          accent="emerald"
        />
        <InventorySummaryCard
          title="Butuh Perhatian"
          value={numberFormatter.format(stats.low + stats.out)}
          caption="Item mendekati minimum atau kosong"
          icon={AlertTriangle}
          accent="amber"
        />
        <InventorySummaryCard
          title="Stok Berlebih"
          value={numberFormatter.format(stats.over)}
          caption="Item melebihi stok maksimum"
          icon={Archive}
          accent="sky"
        />
      </div>

      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nama, kode produk, atau lokasi"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-slate-400" />
                <select
                  value={storeFilter}
                  onChange={(event) => setStoreFilter(event.target.value)}
                  className="h-10 min-w-[180px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua Toko</option>
                  {stores.data?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <BoxSelect className="h-4 w-4 text-slate-400" />
                <select
                  value={stockState}
                  onChange={(event) => setStockState(event.target.value as StockStateFilter)}
                  className="h-10 min-w-[160px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua kondisi</option>
                  <option value="healthy">Sehat</option>
                  <option value="low">Mendekati minimum</option>
                  <option value="out">Stok habis</option>
                  <option value="over">Melebihi maksimum</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <Button variant="outline" onClick={handleRefresh} className="gap-2 rounded-none">
                <RefreshCw className="h-4 w-4" />
                Muat ulang
              </Button>
              <Button asChild className="gap-2 rounded-none">
                <Link to="/stock-opname">
                  <Plus className="h-4 w-4" />
                  Stock Opname
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Inventaris</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">Daftar Barang</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredInventory.length} item
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {inventory.isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
                  <Package className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Belum ada item yang cocok</p>
                  <p className="text-xs text-slate-500">Periksa filter atau mulai proses stock opname.</p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[35%] text-slate-500">Produk</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Stok Fisik</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Stok Sistem</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Minimum</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Kondisi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => {
                      const state = getStockState(item);
                      const isSelected = selectedId === item.id;
                      const badgeVariant =
                        state === "out"
                          ? "destructive"
                          : state === "low"
                            ? "secondary"
                            : state === "over"
                              ? "outline"
                              : "secondary";

                      return (
                        <TableRow
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          data-state={isSelected ? "selected" : undefined}
                          className={cn(
                            "cursor-pointer border-b border-slate-100 transition",
                            isSelected ? "!bg-indigo-50" : "hover:bg-slate-50",
                          )}
                        >
                          <TableCell className="align-top">
                            <p className="text-sm font-semibold text-slate-800">{item.produkNama}</p>
                            <p className="text-xs text-slate-500">{item.produkKode ?? "-"}</p>
                          </TableCell>
                          <TableCell className="align-top font-semibold text-slate-700">
                            {numberFormatter.format(item.stockFisik)}
                          </TableCell>
                          <TableCell className="align-top font-semibold text-slate-700">
                            {numberFormatter.format(item.stockSistem)}
                          </TableCell>
                          <TableCell className="align-top text-slate-600">
                            {item.stockMinimum != null ? numberFormatter.format(item.stockMinimum) : "-"}
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge variant={badgeVariant} className="rounded-full px-3 py-0.5 text-xs">
                              {state === "healthy"
                                ? "Sehat"
                                : state === "low"
                                  ? "Mendekati minimum"
                                  : state === "out"
                                    ? "Stok habis"
                                    : "Melebihi maksimum"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[400px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail Item</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">
                {selectedItem ? selectedItem.produkNama : "Pilih item"}
              </CardTitle>
            </div>
            {selectedItem ? (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                {selectedItem.produkKode ?? "-"}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {!selectedItem ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Package className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih item untuk melihat rincian</p>
                <p className="text-xs text-slate-500">Klik salah satu baris inventaris untuk membuka detail.</p>
              </div>
            ) : (
              <>
                <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Stok fisik</dt>
                      <dd className="text-lg font-semibold text-slate-900">
                        {numberFormatter.format(selectedItem.stockFisik)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Stok sistem</dt>
                      <dd className="text-lg font-semibold text-slate-900">
                        {numberFormatter.format(selectedItem.stockSistem)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Minimum</dt>
                      <dd className="font-semibold text-slate-800">
                        {selectedItem.stockMinimum != null
                          ? numberFormatter.format(selectedItem.stockMinimum)
                          : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Maksimum</dt>
                      <dd className="font-semibold text-slate-800">
                        {selectedItem.stockMaximum != null
                          ? numberFormatter.format(selectedItem.stockMaximum)
                          : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih</dt>
                      <dd
                        className={cn(
                          "text-lg font-semibold",
                          selectedItem.selisih === 0
                            ? "text-slate-700"
                            : selectedItem.selisih > 0
                              ? "text-emerald-600"
                              : "text-rose-600",
                        )}
                      >
                        {numberFormatter.format(selectedItem.selisih)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Lokasi Rak</dt>
                      <dd className="font-semibold text-slate-800">
                        {selectedItem.lokasiRak ?? "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Batch Number</dt>
                      <dd className="font-semibold text-slate-800">
                        {selectedItem.batchNumber ?? "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Expired</dt>
                      <dd className="font-semibold text-slate-800">{formatDate(selectedItem.tanggalExpired)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-inner">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> Lokasi
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedItem.lokasiRak ? (
                      <>
                        Item ditempatkan pada rak <strong>{selectedItem.lokasiRak}</strong>.
                      </>
                    ) : (
                      "Belum ada informasi rak."
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
