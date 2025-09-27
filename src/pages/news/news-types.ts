export type StatusFilter = "all" | "draft" | "aktif" | "nonaktif" | "kedaluwarsa";

export interface NewsItem {
  id: string;
  judul: string;
  konten?: string;
  tipeBerita?: string;
  prioritas?: string;
  authorName?: string;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsStats {
  total: number;
  draft: number;
  aktif: number;
  nonaktif: number;
  kedaluwarsa: number;
  totalViews: number;
}