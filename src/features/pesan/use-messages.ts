import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { InternalMessage } from "@/types/transactions";
import { fetchInternalMessages } from "./api";

const MESSAGE_KEY = ["pesan-messages"];

export function useMessagesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<InternalMessage[]>({
    queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchInternalMessages(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}