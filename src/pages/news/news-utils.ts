import type { NewsItem, StatusFilter, NewsStats } from "./news-types";

export function truncateContent(content: string | undefined, maxLength: number = 100) {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength)}...`;
}

export function getStatusColor(status: string) {
  switch (status) {
    case "aktif":
      return "text-green-600 bg-green-50 border-green-200";
    case "draft":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "nonaktif":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "kedaluwarsa":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "aktif":
      return "Aktif";
    case "draft":
      return "Draft";
    case "nonaktif":
      return "Nonaktif";
    case "kedaluwarsa":
      return "Kedaluwarsa";
    default:
      return status;
  }
}

export function calculateNewsStats(news: NewsItem[]): NewsStats {
  const total = news.length;
  const draft = news.filter((item) => item.status === "draft").length;
  const aktif = news.filter((item) => item.status === "aktif").length;
  const nonaktif = news.filter((item) => item.status === "nonaktif").length;
  const kedaluwarsa = news.filter((item) => item.status === "kedaluwarsa").length;
  const totalViews = news.reduce((sum, item) => sum + item.viewCount, 0);
  return { total, draft, aktif, nonaktif, kedaluwarsa, totalViews };
}

export function filterNews(news: NewsItem[], searchTerm: string, statusFilter: StatusFilter) {
  const query = searchTerm.trim().toLowerCase();
  return news
    .filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.judul.toLowerCase().includes(query) ||
        (item.konten ?? "").toLowerCase().includes(query) ||
        (item.tipeBerita ?? "").toLowerCase().includes(query) ||
        (item.prioritas ?? "").toLowerCase().includes(query) ||
        (item.authorName ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}