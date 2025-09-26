import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessagesQuery } from "@/features/pesan/use-messages";
import { PesanSearchFilters } from "@/features/pesan/components/pesan-search-filters";
import { PesanList } from "@/features/pesan/components/pesan-list";
import { PesanDetail } from "@/features/pesan/components/pesan-detail";

type StatusFilter = "all" | "terkirim" | "draft" | "dibaca";

export function PesanPage() {
  const messages = useMessagesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = messages.data ?? [];
    const total = data.length;
    const terkirim = data.filter((item) => item.status === "terkirim").length;
    const draft = data.filter((item) => item.status === "draft").length;
    return { total, terkirim, draft };
  }, [messages.data]);

  const filteredMessages = useMemo(() => {
    const data = messages.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.judul.toLowerCase().includes(query) ||
          item.isi.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages.data, searchTerm, statusFilter]);

  const selectedMessage = useMemo(() => {
    if (!selectedId) return null;
    return filteredMessages.find((item) => item.id === selectedId) ?? null;
  }, [filteredMessages, selectedId]);

  const handleRefresh = () => {
    messages.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <PesanSearchFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefresh}
            stats={stats}
          />
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Perpesanan Internal</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Pesan</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredMessages.length} pesan
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <PesanList
              messages={filteredMessages}
              isLoading={messages.isLoading}
              selectedId={selectedId}
              onSelectMessage={setSelectedId}
            />
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Pesan</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedMessage ? selectedMessage.judul : "Pilih pesan"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            <PesanDetail message={selectedMessage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}