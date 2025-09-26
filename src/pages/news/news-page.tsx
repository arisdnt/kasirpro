import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useNewsQuery } from "@/features/news/use-news";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Eye,
  User,
  Calendar,
  Tag
} from "lucide-react";

// Align with public.berita.status enum: draft, aktif, nonaktif, kedaluwarsa
type StatusFilter = "all" | "draft" | "aktif" | "nonaktif" | "kedaluwarsa";

export function NewsPage() {
  const news = useNewsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = news.data ?? [];
    const total = data.length;
    const draft = data.filter((item) => item.status === "draft").length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = data.filter((item) => item.status === "nonaktif").length;
    const kedaluwarsa = data.filter((item) => item.status === "kedaluwarsa").length;
    const totalViews = data.reduce((sum, item) => sum + item.viewCount, 0);
    return { total, draft, aktif, nonaktif, kedaluwarsa, totalViews };
  }, [news.data]);

  const filteredNews = useMemo(() => {
    const data = news.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.judul.toLowerCase().includes(query) ||
          (item.konten ?? "").toLowerCase().includes(query) ||
          (item.tipeBerita ?? "").toLowerCase().includes(query) ||
          (item.prioritas ?? "").toLowerCase().includes(query) ||
          (item.authorName ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [news.data, searchTerm, statusFilter]);

  const selectedNews = useMemo(() => {
    if (!selectedId) return null;
    return filteredNews.find((item) => item.id === selectedId) ?? null;
  }, [filteredNews, selectedId]);

  const handleRefresh = () => {
    news.refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-50 border-green-200";
      case "draft":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "archived":
        return "text-slate-600 bg-slate-50 border-slate-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Terbit";
      case "draft":
        return "Draft";
      case "archived":
        return "Arsip";
      default:
        return status;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari judul, kategori, atau penulis"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  <option value="draft">Draft</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="kedaluwarsa">Kedaluwarsa</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.aktif}</strong></span>
                <span>Views: <strong>{stats.totalViews}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Berita baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Berita</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Artikel</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredNews.length} artikel
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {news.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredNews.length === 0 ? (
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
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
                            {/* Ringkasan tidak tersedia di skema saat ini */}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[400px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Berita</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedNews ? truncateContent(selectedNews.judul, 25) : "Pilih artikel"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedNews ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Judul Artikel</dt>
                      <dd className="font-bold text-base text-slate-900 leading-tight">
                        {selectedNews.judul}
                      </dd>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                        <dd>
                          <span className={cn(
                            "px-3 py-1 rounded text-sm font-semibold border capitalize",
                            getStatusColor(selectedNews.status)
                          )}>
                            {getStatusLabel(selectedNews.status)}
                          </span>
                        </dd>
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Views</dt>
                        <dd className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-slate-400" />
                          <span className="font-bold text-lg text-slate-900">{selectedNews.viewCount}</span>
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Artikel
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Penulis</span>
                          <p className="text-slate-700 font-medium">
                            {selectedNews.authorName ?? "Tidak diketahui"}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Kategori</span>
                          <p className="text-slate-700 capitalize">{selectedNews.tipeBerita}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Tipe</span>
                            <p className="text-slate-700 capitalize">{selectedNews.tipeBerita}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Prioritas</span>
                            <p className="text-slate-700 capitalize">{selectedNews.prioritas}</p>
                          </div>
                        </div>

                        {/* Ringkasan tidak tersedia di skema saat ini */}

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Konten</span>
                          <div className="max-h-40 overflow-y-auto text-slate-700 text-sm bg-slate-50 p-3 rounded border">
                            {selectedNews.konten ? (
                              <div className="whitespace-pre-wrap">{selectedNews.konten}</div>
                            ) : (
                              <span className="italic text-slate-500">Tidak ada konten</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                            <p className="text-slate-700">{formatDateTime(selectedNews.createdAt)}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Diupdate</span>
                            <p className="text-slate-700">{formatDateTime(selectedNews.updatedAt)}</p>
                          </div>
                        </div>

                        {/* publishedAt tidak tersedia dalam skema saat ini */}

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">ID Artikel</span>
                          <p className="font-mono text-slate-700">{selectedNews.id}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Newspaper className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih artikel untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris artikel untuk melihat konten lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}