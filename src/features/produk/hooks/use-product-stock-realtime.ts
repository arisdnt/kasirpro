import { useStockRealtimeThrottle } from "@/hooks/use-realtime-throttle";

/**
 * Subscribes to all tables that affect calculated product stock with throttling.
 * Uses optimized throttling based on table priority.
 */
export function useProductStockRealtime(prefix: string, handler: () => void, options?: { enabled?: boolean }) {
  useStockRealtimeThrottle(prefix, handler, options);
}
