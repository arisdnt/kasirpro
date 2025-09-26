import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Boxes, Layers, PackageX } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { InventoryHealth, LowStockItem } from "@/types/dashboard";

const numberFormatter = new Intl.NumberFormat("id-ID");

type DashboardInventoryPanelProps = {
  inventory: InventoryHealth | undefined;
  lowStock: LowStockItem[];
  isLoadingInventory?: boolean;
  isLoadingLowStock?: boolean;
};

export function DashboardInventoryPanel({
  inventory,
  lowStock,
  isLoadingInventory,
  isLoadingLowStock,
}: DashboardInventoryPanelProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const summary = useMemo(
    () => ({
      produkAktif: inventory?.produkAktif ?? 0,
      produkLow: inventory?.produkLow ?? 0,
      produkHabis: inventory?.produkHabis ?? 0,
      nilaiPersediaan: inventory?.nilaiPersediaan ?? 0,
    }),
    [inventory],
  );

  const topLowStock = lowStock.slice(0, 5);

  return (
    <Card className="h-full border border-slate-200/80 bg-white/85 shadow-sm">
      <CardHeader className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-700">
          Kesehatan Persediaan
        </p>
        <p className="text-xs text-slate-500">
          Pantau produk berisiko dan nilai inventaris untuk menjaga operasional
          toko.
        </p>
      </CardHeader>
      <CardBody className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            {isLoadingInventory ? (
              <Skeleton className="h-14 w-full rounded-lg" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-700">
                    Produk Aktif
                  </p>
                  <p className="text-lg font-semibold text-emerald-900">
                    {numberFormatter.format(summary.produkAktif)}
                  </p>
                </div>
                <Boxes className="h-8 w-8 text-emerald-500" />
              </div>
            )}
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
            {isLoadingInventory ? (
              <Skeleton className="h-14 w-full rounded-lg" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700">
                    Stok Menipis
                  </p>
                  <p className="text-lg font-semibold text-amber-900">
                    {numberFormatter.format(summary.produkLow)}
                  </p>
                </div>
                <Layers className="h-8 w-8 text-amber-500" />
              </div>
            )}
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3">
            {isLoadingInventory ? (
              <Skeleton className="h-14 w-full rounded-lg" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-rose-700">
                    Stok Kosong
                  </p>
                  <p className="text-lg font-semibold text-rose-900">
                    {numberFormatter.format(summary.produkHabis)}
                  </p>
                </div>
                <PackageX className="h-8 w-8 text-rose-500" />
              </div>
            )}
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-3">
            {isLoadingInventory ? (
              <Skeleton className="h-14 w-full rounded-lg" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-sky-700">
                    Nilai Persediaan
                  </p>
                  <p className="text-lg font-semibold text-sky-900">
                    {formatCurrency(summary.nilaiPersediaan)}
                  </p>
                </div>
                <Badge color="primary" variant="flat">
                  Estimasi
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            Produk yang perlu prioritas
          </p>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setModalOpen(true)}
          >
            Lihat Detail
          </Button>
        </div>

        <div className="space-y-2">
          {isLoadingLowStock ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          ) : topLowStock.length === 0 ? (
            <p className="text-xs text-slate-500">
              Tidak ada produk yang berada di bawah stok minimum.
            </p>
          ) : (
            <ul className="space-y-2">
              {topLowStock.map((item) => (
                <li
                  key={item.produkId}
                  className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-slate-700">
                      {item.namaProduk}
                    </p>
                    <p className="text-[11px] text-slate-500">{item.tokoNama}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-rose-600">
                      Stok {numberFormatter.format(item.stockTersedia)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Minimal {numberFormatter.format(item.minimumStock)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardBody>

      <Modal isOpen={isModalOpen} onOpenChange={setModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Produk Stok Rendah
                <span className="text-xs font-normal text-slate-500">
                  Daftar lengkap produk yang perlu restock segera.
                </span>
              </ModalHeader>
              <ModalBody>
                {isLoadingLowStock ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-8 w-full rounded-lg" />
                    ))}
                  </div>
                ) : lowStock.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Tidak ada produk yang menipis pada periode ini.
                  </p>
                ) : (
                  <Table removeWrapper aria-label="low stock table">
                    <TableHeader>
                      <TableColumn>Produk</TableColumn>
                      <TableColumn>Toko</TableColumn>
                      <TableColumn className="text-right">Stok</TableColumn>
                      <TableColumn className="text-right">
                        Minimal
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      {lowStock.map((item) => (
                        <TableRow key={item.produkId}>
                          <TableCell className="font-medium text-slate-700">
                            {item.namaProduk}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {item.tokoNama}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold text-rose-600">
                            {numberFormatter.format(item.stockTersedia)}
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500">
                            {numberFormatter.format(item.minimumStock)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
