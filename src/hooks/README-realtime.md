# Realtime Hooks Documentation

## Overview
Dokumentasi penggunaan hooks realtime untuk Supabase di KasirPro.

## Available Hooks

### 1. `useSupabaseRealtime`
Hook dasar untuk subscription realtime Supabase.
```typescript
useSupabaseRealtime(channel, config, callback, options?)
```

### 2. `useRealtimeThrottle`
Hook dengan throttling untuk mencegah excessive updates.
```typescript
useRealtimeThrottle(channel, config, callback, { throttleMs: 1000 })
```

### 3. `useStockRealtimeThrottle`
Hook khusus untuk monitoring stock dengan throttling berbeda per priority.
```typescript
useStockRealtimeThrottle(prefix, handler, options?)
```

### 4. `useProductStockRealtime`
Hook untuk monitoring semua tabel yang mempengaruhi stock produk.
```typescript
useProductStockRealtime(prefix, handler, { enabled: true })
```

### 5. `useRealtimeQueryInvalidation`
Hook untuk invalidasi TanStack Query berdasarkan perubahan database.
```typescript
useRealtimeQueryInvalidation({
  queryKeys: [["products"]],
  tables: ["produk"],
  includeStockTables: true
})
```

### 6. `useRealtimeHealth`
Hook untuk monitoring kesehatan koneksi realtime.
```typescript
const health = useRealtimeHealth(15000) // Check every 15s
```

## Best Practices

1. **Gunakan throttling untuk tabel yang sering berubah**
   ```typescript
   // ✅ Good - untuk stock/transaksi
   useRealtimeThrottle("sales-updates", { table: "transaksi_penjualan" }, handler, { throttleMs: 2000 })

   // ❌ Avoid - tanpa throttling untuk tabel busy
   useSupabaseRealtime("sales-updates", { table: "transaksi_penjualan" }, handler)
   ```

2. **Gunakan enabled option untuk conditional subscriptions**
   ```typescript
   useProductStockRealtime("pos-stock", handler, { enabled: isActive })
   ```

3. **Gunakan prefix yang deskriptif untuk channel names**
   ```typescript
   // ✅ Good
   useProductStockRealtime("dashboard-overview", handler)
   useProductStockRealtime("pos-checkout", handler)

   // ❌ Avoid
   useProductStockRealtime("stock1", handler)
   ```

## Throttling Guidelines

- **High Priority (1s)**: item_transaksi_penjualan, item_transaksi_pembelian
- **Normal Priority (2s)**: transaksi_*, stock_opname_items, item_retur_*
- **Low Priority (3s)**: retur_*, stock_opname

## Channel Management

- Channels di-manage otomatis oleh `channelManager`
- Auto-reconnection pada error/timeout
- Health check setiap 30 detik
- Auto-cleanup stale channels

## Monitoring

Status realtime dapat dilihat di status bar (kanan bawah) dengan format:
- 🟢 RT(5) = Connected dengan 5 channels aktif
- 🟡 RT(3) = Connecting dengan 3 channels
- 🔴 RT = Disconnected

## Debugging

Gunakan browser console untuk melihat realtime logs:
- ✅ Channel subscribed
- ❌ Channel error
- ⏱️ Channel timeout
- 📡 Realtime events