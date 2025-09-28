import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Supplier } from "@/features/suppliers/types";
import { Factory } from "lucide-react";
import { SupplierCard } from "./supplier-card";

interface SuppliersGridProps {
  suppliers: Supplier[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectSupplier: (id: string) => void;
}

export function SuppliersGrid({ suppliers, isLoading, selectedId, onSelectSupplier }: SuppliersGridProps) {
  return (
    <Card
      className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none"
      style={{
        backgroundColor: "#f6f9ff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardHeader
        className="shrink-0 flex flex-row items-center justify-between gap-2 py-2"
        style={{ backgroundColor: "#f6f9ff" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Supplier</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Supplier</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: "#3b91f9" }}>
          {suppliers.length} supplier
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
        ) : suppliers.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Factory className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada supplier yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan supplier baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: "#f6f9ff" }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[24%] text-slate-500">Supplier</TableHead>
                    <TableHead className="w-[22%] text-slate-500">Kontak</TableHead>
                    <TableHead className="w-[22%] text-slate-500">Lokasi</TableHead>
                    <TableHead className="w-[18%] text-slate-500">Status &amp; Kredit</TableHead>
                    <TableHead className="w-[14%] text-slate-500 text-right">Terakhir Diperbarui</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {suppliers.map((supplier, index) => (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      isSelected={supplier.id === selectedId}
                      index={index}
                      onSelect={onSelectSupplier}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
