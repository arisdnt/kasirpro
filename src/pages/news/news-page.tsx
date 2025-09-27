import { useState, useMemo } from "react";
import { useNewsQuery } from "@/features/news/use-news";
import { NewsFilters } from "./components/news-filters";
import { NewsStatistics } from "./components/news-statistics";
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

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <div className="shrink-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center bg-white/95 border border-primary/10 shadow-sm rounded-none p-4 text-black">
          <NewsFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
          />
          <NewsStatistics
            stats={stats}
            onRefresh={handleRefresh}
            isRefreshing={news.isFetching}
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <NewsTable
            data={filteredNews}
            isLoading={news.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NewsDetail selectedNews={selectedNews} />
        </div>
      </div>
    </div>
  );
}
