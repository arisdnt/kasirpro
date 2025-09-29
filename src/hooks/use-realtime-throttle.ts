import { useCallback, useRef } from "react";
import { useSupabaseRealtime, type RealtimeConfig } from "./use-supabase-realtime";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

/**
 * Hook realtime dengan throttling untuk mencegah excessive updates
 * Berguna untuk tables yang sering berubah seperti stock, transaksi
 */
export function useRealtimeThrottle(
  channel: string,
  config: RealtimeConfig,
  callback: () => void,
  options?: {
    enabled?: boolean;
    throttleMs?: number;
  }
) {
  const throttleMs = options?.throttleMs || 1000;
  const lastCallTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime.current;

    if (timeSinceLastCall >= throttleMs) {
      lastCallTime.current = now;
      callback();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCallTime.current = Date.now();
        callback();
      }, throttleMs - timeSinceLastCall);
    }
  }, [callback, throttleMs]);

  useSupabaseRealtime(
    channel,
    config,
    throttledCallback,
    { enabled: options?.enabled }
  );

  return {
    channelName: channel,
    throttleMs,
  };
}

/**
 * Hook khusus untuk monitoring stock dengan throttling yang sesuai
 * Menggabungkan multiple table subscriptions dengan throttling
 */
export function useStockRealtimeThrottle(
  prefix: string,
  handler: () => void,
  options?: { enabled?: boolean }
) {
  const { state: { user } } = useSupabaseAuth();

  // Tables yang mempengaruhi stock dengan priority berbeda
  const highPriorityTables = [
    'item_transaksi_penjualan',
    'item_transaksi_pembelian',
  ];

  const normalPriorityTables = [
    'transaksi_penjualan',
    'transaksi_pembelian',
    'stock_opname_items',
    'item_retur_penjualan',
    'item_retur_pembelian',
  ];

  const lowPriorityTables = [
    'retur_penjualan',
    'retur_pembelian',
    'stock_opname',
  ];

  // Hanya sebagian tabel memiliki kolom tenant_id — tambahkan filter untuk mengurangi event volume
  const tablesWithTenantId = new Set([
    'transaksi_penjualan',
    'transaksi_pembelian',
    'retur_penjualan',
    'retur_pembelian',
    'stock_opname',
  ]);

  // High priority: throttle 1 detik
  highPriorityTables.forEach((table) => {
    useRealtimeThrottle(
      `${prefix}-${table}`,
      {
        table,
        filter: user?.tenantId && tablesWithTenantId.has(table)
          ? `tenant_id=eq.${user.tenantId}`
          : undefined,
      },
      handler,
      { ...options, throttleMs: 1000 }
    );
  });

  // Normal priority: throttle 2 detik
  normalPriorityTables.forEach((table) => {
    useRealtimeThrottle(
      `${prefix}-${table}`,
      {
        table,
        filter: user?.tenantId && tablesWithTenantId.has(table)
          ? `tenant_id=eq.${user.tenantId}`
          : undefined,
      },
      handler,
      { ...options, throttleMs: 2000 }
    );
  });

  // Low priority: throttle 3 detik
  lowPriorityTables.forEach((table) => {
    useRealtimeThrottle(
      `${prefix}-${table}`,
      {
        table,
        filter: user?.tenantId && tablesWithTenantId.has(table)
          ? `tenant_id=eq.${user.tenantId}`
          : undefined,
      },
      handler,
      { ...options, throttleMs: 3000 }
    );
  });
}
