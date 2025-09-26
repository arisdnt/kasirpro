import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { NewsArticle } from "@/types/transactions";
import { fetchNews } from "./api";

const NEWS_KEY = ["news"];

export function useNewsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<NewsArticle[]>({
    queryKey: [...NEWS_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchNews(user!.tenantId),
    staleTime: 1000 * 60,
  });
}