import { useState, useMemo } from "react";
import { useNewsQuery } from "@/features/news/use-news";
import { NewsFilters } from "./components/news-filters";
import { NewsTable } from "./components/news-table";
import { NewsDetail } from "./components/news-detail";
import { calculateNewsStats, filterNews } from "./news-utils";
import type { StatusFilter } from "./news-types";

export function NewsPage() {
  const news = useNewsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => calculateNewsStats(news.data ?? []), [news.data]);
  const filteredNews = useMemo(() => filterNews(news.data ?? [], searchTerm, statusFilter), [news.data, searchTerm, statusFilter]);
  const selectedNews = useMemo(() => {
    if (!selectedId) return null;
    return filteredNews.find((item) => item.id === selectedId) ?? null;
  }, [filteredNews, selectedId]);

  const handleRefresh = () => {
    news.refetch();
  };

  const handleAddNews = () => {
    // TODO: Implement add news functionality
    console.log('Add news functionality coming soon');
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <NewsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        stats={stats}
        isRefreshing={news.isFetching}
        onRefresh={handleRefresh}
        onAddNews={handleAddNews}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <NewsTable
            data={filteredNews}
            isLoading={news.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <NewsDetail selectedNews={selectedNews} />
        </div>
      </div>
    </div>
  );
}
