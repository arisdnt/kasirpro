import { useEffect, useState } from "react";
import { channelManager } from "@/lib/supabase-realtime-config";

export interface RealtimeHealthStatus {
  isHealthy: boolean;
  totalChannels: number;
  staleChannels: string[];
  debugInfo: ReturnType<typeof channelManager.getDebugInfo>;
}

/**
 * Hook untuk monitoring kesehatan realtime connections
 * Berguna untuk debugging dan monitoring dashboard
 */
export function useRealtimeHealth(intervalMs: number = 30000) {
  const [healthStatus, setHealthStatus] = useState<RealtimeHealthStatus>({
    isHealthy: true,
    totalChannels: 0,
    staleChannels: [],
    debugInfo: {
      totalChannels: 0,
      channelNames: [],
      tableSubscribers: {},
    },
  });

  useEffect(() => {
    const checkHealth = () => {
      const healthCheck = channelManager.healthCheck();
      const debugInfo = channelManager.getDebugInfo();

      setHealthStatus({
        isHealthy: healthCheck.healthy,
        totalChannels: healthCheck.totalChannels,
        staleChannels: healthCheck.staleChannels,
        debugInfo,
      });

      // Log health status untuk debugging
      if (!healthCheck.healthy) {
        console.warn("Realtime health check failed:", healthCheck);
      } else {
        console.log("Realtime health check passed:", {
          channels: healthCheck.totalChannels,
          tables: Object.keys(debugInfo.tableSubscribers).length,
        });
      }
    };

    // Initial check
    checkHealth();

    // Periodic health checks
    const interval = setInterval(checkHealth, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return healthStatus;
}

/**
 * Development helper untuk debugging realtime channels
 */
export function useRealtimeDebugger() {
  return {
    getDebugInfo: () => channelManager.getDebugInfo(),
    forceHealthCheck: () => channelManager.healthCheck(),
    getActiveChannels: () => channelManager.getActiveChannels(),
    getChannelsByTable: (table: string) => channelManager.getChannelsByTable(table),
  };
}