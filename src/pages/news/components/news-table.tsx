import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@heroui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Eye, Newspaper, Tag, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { NewsItem } from "../news-types";
import { getStatusColor, getStatusLabel } from "../news-utils";

interface NewsTableProps {
  data: NewsItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  onDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NewsTable({ data, isLoading, selectedId, onSelectItem, onDetail, onEdit, onDelete }: NewsTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Berita</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Artikel</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {data.length} artikel
        </Badge>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Newspaper className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada berita yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau buat artikel baru untuk memulai.
              </p>
            </div>
          ) : (
            <>
              {/* Fixed Header */}
              <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
                <Table className="min-w-full text-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%] text-slate-500" style={{ width: '30%' }}>Judul</TableHead>
                      <TableHead className="w-[15%] text-slate-500" style={{ width: '15%' }}>Tipe</TableHead>
                      <TableHead className="w-[15%] text-slate-500" style={{ width: '15%' }}>Penulis</TableHead>
                      <TableHead className="w-[10%] text-slate-500" style={{ width: '10%' }}>Status</TableHead>
                      <TableHead className="w-[8%] text-slate-500" style={{ width: '8%' }}>Views</TableHead>
                      <TableHead className="w-[12%] text-slate-500" style={{ width: '12%' }}>Dibuat</TableHead>
                      <TableHead className="w-[10%] text-slate-500" style={{ width: '10%' }}>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body */}
              <ScrollArea className="flex-1">
                <Table className="min-w-full text-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow
                        key={item.id}
                        onClick={() => onSelectItem(item.id)}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition h-14",
                          item.id === selectedId
                            ? "text-black"
                            : index % 2 === 0
                              ? "bg-white hover:bg-slate-50"
                              : "bg-gray-50/50 hover:bg-slate-100"
                        )}
                        style={item.id === selectedId ? { backgroundColor: '#e6f4f1' } : undefined}
                      >
                        <TableCell className="w-[30%] align-middle py-4" style={{ width: '30%' }}>
                          <span className="font-medium text-slate-800 line-clamp-2">
                            {item.judul}
                          </span>
                        </TableCell>
                        <TableCell className="w-[15%] align-middle py-4 text-slate-700" style={{ width: '15%' }}>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-slate-400" />
                            <span className="capitalize truncate">{item.tipeBerita}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[15%] align-middle py-4 text-slate-700" style={{ width: '15%' }}>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{item.authorName ?? "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[10%] align-middle py-4" style={{ width: '10%' }}>
                          <Badge variant="secondary" className={cn("text-xs rounded", getStatusColor(item.status))}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[8%] align-middle py-4 text-center font-semibold text-slate-900" style={{ width: '8%' }}>
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3 text-slate-400" />
                            {item.viewCount}
                          </div>
                        </TableCell>
                        <TableCell className="w-[12%] align-middle py-4 text-xs text-slate-600" style={{ width: '12%' }}>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{formatDateTime(item.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[10%] align-middle py-4" style={{ width: '10%' }}>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); (onDetail ?? onSelectItem)(item.id); }} className="h-7 w-7 p-0 rounded-none hover:bg-blue-100">
                              <Eye className="h-3.5 w-3.5 text-blue-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit?.(item.id); }} className="h-7 w-7 p-0 rounded-none hover:bg-green-100">
                              <Edit className="h-3.5 w-3.5 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }} className="h-7 w-7 p-0 rounded-none hover:bg-red-100">
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          )}
        </ScrollArea>
      </CardBody>
    </Card>
  );
}