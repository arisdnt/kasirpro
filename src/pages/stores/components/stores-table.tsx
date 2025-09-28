import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Toko } from "@/features/stores/types";
import { Building } from "lucide-react";
import { StoreTableRow } from "./store-table-row";

interface StoresTableProps {
  stores: Toko[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectStore: (id: string) => void;
}

export function StoresTable({ stores, isLoading, selectedId, onSelectStore }: StoresTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Toko</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Toko</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {stores.length} toko
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
            <Building className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada toko yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan toko baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%] text-slate-500">Nama Toko</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Kode</TableHead>
                    <TableHead className="w-[25%] text-slate-500">Alamat</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Zona Waktu</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Dibuat</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {stores.map((store, index) => (
                    <StoreTableRow
                      key={store.id}
                      store={store}
                      isSelected={store.id === selectedId}
                      onSelect={onSelectStore}
                      index={index}
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