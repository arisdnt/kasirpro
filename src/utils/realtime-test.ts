import { getSupabaseClient } from "@/lib/supabase-client";

/**
 * Test utilities untuk debugging realtime functionality
 * HANYA UNTUK DEVELOPMENT - jangan digunakan di production
 */

export async function testRealtimeInsert(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();

  console.log("🧪 Testing realtime with INSERT...");

  try {
    const testData = {
      tenant_id: tenantId,
      toko_id: tokoId,
      nomor_transaksi: `TEST-${Date.now()}`,
      tanggal: new Date().toISOString(),
      total: 1000,
      bayar: 1000,
      kembalian: 0,
      metode_pembayaran: 'cash',
      created_at: new Date().toISOString()
    };

    console.log("Inserting test data:", testData);

    const { data, error } = await client
      .from('transaksi_penjualan')
      .insert(testData)
      .select();

    if (error) {
      console.error("❌ Insert failed:", error);
      return { success: false, error };
    }

    console.log("✅ Insert successful:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Exception during insert:", error);
    return { success: false, error };
  }
}

export async function testRealtimeUpdate(transactionId: string) {
  const client = getSupabaseClient();

  console.log("🧪 Testing realtime with UPDATE...");

  try {
    const { data, error } = await client
      .from('transaksi_penjualan')
      .update({
        total: Math.floor(Math.random() * 10000),
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select();

    if (error) {
      console.error("❌ Update failed:", error);
      return { success: false, error };
    }

    console.log("✅ Update successful:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Exception during update:", error);
    return { success: false, error };
  }
}

/**
 * Check Supabase realtime connection status
 */
export function checkSupabaseRealtimeStatus() {
  const client = getSupabaseClient();

  console.group("🔍 Supabase Realtime Status Check");
  console.log("Client:", client);
  console.log("Realtime instance:", client.realtime);

  // Check if realtime is connected
  try {
    const rtStatus = (client.realtime as any)?.connection?.readyState;
    console.log("WebSocket readyState:", rtStatus);
    console.log("Status meaning:", {
      0: "CONNECTING",
      1: "OPEN",
      2: "CLOSING",
      3: "CLOSED"
    }[rtStatus] || "UNKNOWN");
  } catch (e) {
    console.log("Cannot read realtime status:", e);
  }

  console.groupEnd();
}

/**
 * Tambahkan test functions ke window untuk debugging dari console
 */
export function setupRealtimeTestFunctions(tenantId?: string, tokoId?: string | null) {
  if (typeof window !== 'undefined') {
    (window as any).testRealtimeInsert = () => {
      if (!tenantId) {
        console.error("❌ tenantId not provided");
        return;
      }
      return testRealtimeInsert(tenantId, tokoId || null);
    };

    (window as any).testRealtimeUpdate = (transactionId: string) => {
      return testRealtimeUpdate(transactionId);
    };

    (window as any).checkSupabaseRealtimeStatus = checkSupabaseRealtimeStatus;

    console.log("🧪 Realtime test functions available:");
    console.log("- window.testRealtimeInsert() - Insert test transaction");
    console.log("- window.testRealtimeUpdate(id) - Update existing transaction");
    console.log("- window.checkSupabaseRealtimeStatus() - Check Supabase connection");
  }
}