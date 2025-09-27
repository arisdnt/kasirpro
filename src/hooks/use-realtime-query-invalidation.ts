import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSupabaseRealtime } from "./use-supabase-realtime";
import { useProductStockRealtime } from "@/features/produk/hooks/use-product-stock-realtime";

interface RealtimeInvalidationConfig {
  queryKeys: (string | string[])[];
  tables?: string[];
  prefix?: string;
  includeStockTables?: boolean;
}

/**
 * Generic hook for realtime query invalidation
 * Automatically invalidates specified query keys when database tables change
 */
export function useRealtimeQueryInvalidation(config: RealtimeInvalidationConfig) {
  const queryClient = useQueryClient();
  const prefix = config.prefix || "realtime-invalidation";

  const invalidateQueries = useCallback(() => {
    config.queryKeys.forEach(queryKey => {
      if (Array.isArray(queryKey)) {
        queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    });
  }, [queryClient, config.queryKeys]);

  // Subscribe to specific tables if provided
  if (config.tables) {
    config.tables.forEach((table, index) => {
      useSupabaseRealtime(
        `${prefix}-${table}-${index}`,
        { table },
        invalidateQueries
      );
    });
  }

  // Subscribe to stock-affecting tables if requested
  if (config.includeStockTables) {
    useProductStockRealtime(`${prefix}-stock`, invalidateQueries);
  }

  return { invalidateQueries };
}