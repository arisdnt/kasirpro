import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PromoWithRelations } from "@/features/promo/types";
import { Edit, Eye, Percent, Trash2 } from "lucide-react";

export type PromoTiming = "upcoming" | "active" | "expired";

type PromoListProps = {
  promos: PromoWithRelations[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectPromo: (id: string) => void;
  getPromoTiming: (promo: PromoWithRelations) => PromoTiming;
  onViewDetail: (promo: PromoWithRelations) => void;
  onEditPromo: (promo: PromoWithRelations) => void;
  onDeletePromo: (promo: PromoWithRelations) => void;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export function PromoList({
  promos,
  isLoading,
  selectedId,
  onSelectPromo,
  getPromoTiming,
  onViewDetail,
  onEditPromo,
  onDeletePromo,
}: PromoListProps) {
  return (
    <Card
      className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none"
      style={{ backgroundColor: "#f6f9ff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
    >
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: "#f6f9ff" }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Promo</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Promo</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: "#3b91f9" }}>
          {promos.length} promo
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </ScrollArea>
        ) : promos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Percent className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada promo yang cocok</p>
            <p className="text-xs text-slate-500">Sesuaikan pencarian atau tambahkan promo baru.</p>
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: "#f6f9ff" }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%] text-slate-500">Nama Promo</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Kode</TableHead>
                    <TableHead className="w-[18%] text-slate-500">Periode</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Nilai</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Tipe</TableHead>
                    <TableHead className="w-[8%] text-slate-500">Level</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Toko</TableHead>
                    <TableHead className="w-[5%] text-slate-500">Prioritas</TableHead>
                    <TableHead className="w-[5%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[10%] text-slate-500 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {promos.map((promo, index) => {
                    const timing = getPromoTiming(promo);
                    const isSelected = promo.id === selectedId;

                    return (
                      <TableRow
                        key={promo.id}
                        onClick={() => onSelectPromo(promo.id)}
                        data-state={isSelected ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition h-14",
                          isSelected
                            ? "text-black"
                            : index % 2 === 0
                              ? "bg-white hover:bg-slate-50"
                              : "bg-gray-50/50 hover:bg-slate-100"
                        )}
                        style={isSelected ? { backgroundColor: "#e6f4f1" } : undefined}
                      >
                        <TableCell className={cn("w-[22%] align-middle py-4", isSelected ? "text-black" : "text-slate-800")}>{promo.nama}</TableCell>
                        <TableCell className={cn("w-[10%] align-middle py-4 font-mono text-xs", isSelected ? "text-black" : "text-slate-600")}>
                          {promo.kode ?? "-"}
                        </TableCell>
                        <TableCell className={cn("w-[18%] align-middle py-4 text-xs", isSelected ? "text-black" : "text-slate-600")}
                        >
                          {dateFormatter.format(new Date(promo.mulai))}
                          {promo.selesai ? ` – ${dateFormatter.format(new Date(promo.selesai))}` : ""}
                        </TableCell>
                        <TableCell className={cn("w-[10%] align-middle py-4 font-semibold", isSelected ? "text-black" : "text-slate-800")}
                        >
                          {promo.tipe === "diskon_persen"
                            ? `${promo.nilai}%`
                            : formatCurrency(promo.nilai)}
                        </TableCell>
                        <TableCell className={cn("w-[10%] align-middle py-4", isSelected ? "text-black" : "text-slate-600")}>{promo.tipe}</TableCell>
                        <TableCell className={cn("w-[8%] align-middle py-4", isSelected ? "text-black" : "text-slate-600")}>{promo.level}</TableCell>
                        <TableCell className={cn("w-[12%] align-middle py-4", isSelected ? "text-black" : "text-slate-600")}>{promo.tokoNama ?? "Semua toko"}</TableCell>
                        <TableCell className={cn("w-[5%] align-middle py-4", isSelected ? "text-black" : "text-slate-600")}>{promo.prioritas}</TableCell>
                        <TableCell className="w-[5%] align-middle py-4">
                          <Badge
                            variant="secondary"
                            className="rounded-none px-2 py-0.5 text-[10px] font-semibold"
                            style={timing === "active"
                              ? { backgroundColor: "#dcf6e9", color: "#047857" }
                              : timing === "upcoming"
                                ? { backgroundColor: "#fef3c7", color: "#b45309" }
                                : { backgroundColor: "#fee2e2", color: "#b91c1c" }}
                          >
                            {promo.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[10%] align-middle py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-blue-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                onViewDetail(promo);
                              }}
                              title="Detail"
                            >
                              <Eye className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-green-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                onEditPromo(promo);
                              }}
                              title="Edit"
                            >
                              <Edit className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                onDeletePromo(promo);
                              }}
                              title="Hapus"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
