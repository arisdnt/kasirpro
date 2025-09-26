import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { getStatusBadgeVariant, formatContactInfo, formatDisplayValue } from "./customers-utils";

interface Customer {
  id: string;
  nama: string;
  status: string;
  kode?: string | null;
  telepon?: string | null;
  email?: string | null;
  totalTransaksi?: number | null;
  poinRewards?: number | null;
  frekuensiTransaksi?: number | null;
}

interface CustomersTableProps {
  data: Customer[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function CustomersTable({ data, isLoading, selectedId, onSelectItem }: CustomersTableProps) {
  return (
    <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Pelanggan</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Pelanggan</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} pelanggan
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Users className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada pelanggan yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan pelanggan baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[25%] text-slate-500">Nama</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Kontak</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Transaksi</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Poin</TableHead>
                  <TableHead className="w-[25%] text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const contact = formatContactInfo(item.telepon, item.email);
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      data-state={item.id === selectedId ? "selected" : undefined}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition",
                        item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                      )}
                    >
                      <TableCell className="align-top">
                        <div>
                          <span className={cn(
                            "font-medium",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.nama}
                          </span>
                          {item.kode && (
                            <p className="text-xs text-slate-500">{item.kode}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col text-xs text-slate-600">
                          <span>{contact.telepon}</span>
                          <span>{contact.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        "align-top font-semibold",
                        item.id === selectedId ? "text-black" : "text-slate-700"
                      )}>
                        {formatDisplayValue(item.totalTransaksi, "0")}
                      </TableCell>
                      <TableCell className={cn(
                        "align-top font-semibold",
                        item.id === selectedId ? "text-black" : "text-slate-700"
                      )}>
                        {item.poinRewards ?? 0}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge
                          variant={getStatusBadgeVariant(item.status)}
                          className="text-xs rounded-none"
                        >
                          {formatDisplayValue(item.status)}
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
  );
}