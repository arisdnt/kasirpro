import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Supplier</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Supplier Aktif</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {suppliers.length} supplier
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Factory className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada supplier yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan supplier baru untuk memulai.
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  isSelected={supplier.id === selectedId}
                  onSelect={onSelectSupplier}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}