import { useEffect } from "react";
import { channelManager } from "@/lib/supabase-realtime-config";

/**
 * Debug hook untuk monitoring realtime subscriptions
 * Hanya untuk development, jangan digunakan di production
 */
export function useRealtimeDebug() {
  useEffect(() => {
    // Log status setiap 10 detik
    const interval = setInterval(() => {
      const debugInfo = channelManager.getDebugInfo();
      console.group("🔍 Realtime Debug Info");
      console.log("Total Channels:", debugInfo.totalChannels);
      console.log("Active Channels:", debugInfo.channelNames);
      console.log("Table Subscribers:", debugInfo.tableSubscribers);

      // Health check
      const health = channelManager.healthCheck();
      console.log("Health Status:", health);
      console.groupEnd();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Return debugging functions
  return {
    logChannels: () => {
      const debugInfo = channelManager.getDebugInfo();
      console.table(debugInfo.channelNames);
    },
    logTableSubscribers: () => {
      const debugInfo = channelManager.getDebugInfo();
      console.table(debugInfo.tableSubscribers);
    },
    forceHealthCheck: () => {
      return channelManager.healthCheck();
    }
  };
}

/**
 * Hook untuk test manual realtime connection
 */
export function useRealtimeConnectionTest() {
  useEffect(() => {
    console.log("🧪 Starting realtime connection test...");

    // Test function yang bisa dipanggil dari console
    (window as any).testRealtimeConnection = () => {
      const debugInfo = channelManager.getDebugInfo();
      console.group("🧪 Realtime Connection Test");
      console.log("Channels:", debugInfo.totalChannels);
      console.log("Channel names:", debugInfo.channelNames);
      console.log("Table subscribers:", debugInfo.tableSubscribers);

      // Test manual trigger
      console.log("Testing manual trigger...");
      const testCallback = () => {
        console.log("✅ Test callback triggered!");
      };

      console.log("Available test functions:");
      console.log("- window.testRealtimeConnection() - Run this test");
      console.log("- window.logRealtimeChannels() - Show all channels");
      console.groupEnd();
    };

    (window as any).logRealtimeChannels = () => {
      const debugInfo = channelManager.getDebugInfo();
      console.table(debugInfo);
    };

    return () => {
      delete (window as any).testRealtimeConnection;
      delete (window as any).logRealtimeChannels;
    };
  }, []);
}