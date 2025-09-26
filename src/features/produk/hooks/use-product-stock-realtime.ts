import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

/**
 * Subscribes to all tables that affect calculated product stock so we can invalidate caches consistently.
 * The channel prefix keeps subscription names distinct per caller.
 */
export function useProductStockRealtime(prefix: string, handler: () => void) {
  useSupabaseRealtime(`${prefix}-item-transaksi-pembelian`, { table: "item_transaksi_pembelian" }, handler);
  useSupabaseRealtime(`${prefix}-transaksi-pembelian`, { table: "transaksi_pembelian" }, handler);
  useSupabaseRealtime(`${prefix}-item-transaksi-penjualan`, { table: "item_transaksi_penjualan" }, handler);
  useSupabaseRealtime(`${prefix}-transaksi-penjualan`, { table: "transaksi_penjualan" }, handler);
  useSupabaseRealtime(`${prefix}-item-retur-pembelian`, { table: "item_retur_pembelian" }, handler);
  useSupabaseRealtime(`${prefix}-retur-pembelian`, { table: "retur_pembelian" }, handler);
  useSupabaseRealtime(`${prefix}-item-retur-penjualan`, { table: "item_retur_penjualan" }, handler);
  useSupabaseRealtime(`${prefix}-retur-penjualan`, { table: "retur_penjualan" }, handler);
  useSupabaseRealtime(`${prefix}-stock-opname-items`, { table: "stock_opname_items" }, handler);
  useSupabaseRealtime(`${prefix}-stock-opname`, { table: "stock_opname" }, handler);
}
