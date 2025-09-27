import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Eye, Newspaper, Tag, User } from "lucide-react";
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
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Berita</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Artikel</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {data.length} artikel
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
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
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[30%] text-slate-500">Judul</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Tipe</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Penulis</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Views</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Dibuat</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
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
                      <div className="space-y-1">
                        <span className={cn(
                          "font-medium line-clamp-2",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.judul}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <span className="capitalize">{item.tipeBerita}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span className="truncate">{item.authorName ?? "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border capitalize",
                        getStatusColor(item.status)
                      )}>
                        {getStatusLabel(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top text-center font-semibold",
                      item.id === selectedId ? "text-black" : "text-slate-900"
                    )}>
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3 text-slate-400" />
                        {item.viewCount}
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top text-xs",
                      item.id === selectedId ? "text-black" : "text-slate-600"
                    )}>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {formatDateTime(item.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          title="Detail"
                          onClick={(e) => { e.stopPropagation(); (onDetail ?? onSelectItem)(item.id); }}
                          className="text-xs rounded-none bg-slate-800 px-2 py-1 text-white hover:opacity-90"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={(e) => { e.stopPropagation(); onEdit?.(item.id); }}
                          className="text-xs rounded-none bg-[#476EAE] px-2 py-1 text-white hover:opacity-90"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          title="Hapus"
                          onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }}
                          className="text-xs rounded-none bg-red-600 px-2 py-1 text-white hover:opacity-90"
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}