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
import { cn } from "@/lib/utils";
import { Edit, Eye, Trash2, Users } from "lucide-react";
import { formatContactInfo, formatDisplayValue, getStatusTone } from "../customers-utils";

export type CustomerRow = {
  id: string;
  nama: string;
  kode?: string | null;
  telepon?: string | null;
  email?: string | null;
  totalTransaksi?: number | null;
  poinRewards?: number | null;
  status?: string | null;
};

interface CustomerListProps {
  data: CustomerRow[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onViewDetail: (customer: CustomerRow) => void;
  onEdit: (customer: CustomerRow) => void;
  onDelete: (customer: CustomerRow) => void;
}

export function CustomerList({
  data,
  isLoading,
  selectedId,
  onSelect,
  onViewDetail,
  onEdit,
  onDelete,
}: CustomerListProps) {
  return (
    <Card
      className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none"
      style={{ backgroundColor: "#f6f9ff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
    >
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: "#f6f9ff" }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Pelanggan</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Pelanggan</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: "#3b91f9" }}>
          {data.length} pelanggan
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
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada pelanggan yang cocok</p>
            <p className="text-xs text-slate-500">Sesuaikan pencarian atau tambahkan pelanggan baru.</p>
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: "#f6f9ff" }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[24%] text-slate-500">Nama</TableHead>
                    <TableHead className="w-[24%] text-slate-500">Kontak</TableHead>
                    <TableHead className="w-[16%] text-slate-500">Total Transaksi</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Poin</TableHead>
                    <TableHead className="w-[12%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[12%] text-slate-500 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {data.map((customer, index) => {
                    const contact = formatContactInfo(customer.telepon, customer.email);
                    const isSelected = customer.id === selectedId;
                    const statusTone = getStatusTone(customer.status);

                    return (
                      <TableRow
                        key={customer.id}
                        onClick={() => onSelect(customer.id)}
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
                        <TableCell className="align-middle py-4">
                          <div className="flex flex-col">
                            <span className={cn("font-semibold", isSelected ? "text-black" : "text-slate-800")}>{customer.nama}</span>
                            {customer.kode ? (
                              <span className="text-xs text-slate-500">Kode: {customer.kode}</span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="align-middle py-4 text-xs text-slate-600">
                          <div className="flex flex-col gap-0.5">
                            <span>{contact.telepon}</span>
                            <span>{contact.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className={cn("align-middle py-4 font-semibold", isSelected ? "text-black" : "text-slate-700")}>{formatDisplayValue(customer.totalTransaksi, "0")}</TableCell>
                        <TableCell className={cn("align-middle py-4 font-semibold", isSelected ? "text-black" : "text-slate-700")}>{customer.poinRewards ?? 0}</TableCell>
                        <TableCell className="align-middle py-4">
                          <Badge
                            variant="secondary"
                            className="rounded-none px-2 py-0.5 text-[10px] font-semibold"
                            style={statusTone}
                          >
                            {formatDisplayValue(customer.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-middle py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-blue-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                onViewDetail(customer);
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
                                onEdit(customer);
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
                                onDelete(customer);
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
