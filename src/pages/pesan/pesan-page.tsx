import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessagesQuery } from "@/features/pesan/use-messages";
import { PesanSearchFilters } from "@/features/pesan/components/pesan-search-filters";
import { PesanList } from "@/features/pesan/components/pesan-list";
import { PesanDetail } from "@/features/pesan/components/pesan-detail";
import { PesanComposeModal } from "@/features/pesan/components/pesan-compose-modal";
import { useCreateMessageMutation, useDeleteMessageMutation, useMarkReadMessageMutation, useUpdateMessageMutation } from "@/features/pesan/mutations";
import type { InternalMessage } from "@/features/pesan/types";

type StatusFilter = "all" | "terkirim" | "draft" | "dibaca";

export function PesanPage() {
  const messages = useMessagesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editMessage, setEditMessage] = useState<InternalMessage | null>(null);

  const createMutation = useCreateMessageMutation();
  const deleteMutation = useDeleteMessageMutation();
  const markReadMutation = useMarkReadMessageMutation();
  const updateMutation = useUpdateMessageMutation(editMessage?.id ?? "");

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

  const handleOpenCreate = () => {
    setEditMessage(null);
    setComposeOpen(true);
  };

  const handleEdit = (msg: InternalMessage) => {
    setEditMessage(msg);
    setComposeOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    if (selectedId === id) setSelectedId(null);
  };

  const handleMarkRead = async (id: string) => {
    await markReadMutation.mutateAsync(id);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <PesanSearchFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        onCreateNew={handleOpenCreate}
        stats={stats}
        isRefreshing={messages.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
            backgroundColor: '#f6f9ff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Pesan</span>
                <span className="text-black">•</span>
                <CardTitle className="text-sm text-black">Daftar Pesan</CardTitle>
              </div>
              <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
                {filteredMessages.length} pesan
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
              <PesanList
                messages={filteredMessages}
                isLoading={messages.isLoading}
                selectedId={selectedId}
                onSelectMessage={setSelectedId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <PesanDetail
            message={selectedMessage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkRead={handleMarkRead}
          />
        </div>
      </div>

      <PesanComposeModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        mode={editMessage ? "edit" : "create"}
        initial={editMessage}
        onSubmit={async (input) => {
          if (editMessage) {
            await updateMutation.mutateAsync({ ...input });
          } else {
            await createMutation.mutateAsync(input);
          }
        }}
      />
    </div>
  );
}
