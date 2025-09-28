/**
 * Enhanced Supabase Realtime Configuration
 * Optimized for better performance and reliability
 */

import { SupabaseClient } from "@supabase/supabase-js";

export const ENHANCED_REALTIME_CONFIG = {
  // Increase events per second for better responsiveness
  eventsPerSecond: 10,

  // Connection retry settings - sesuai dokumentasi: heartbeat setiap 25 detik
  heartbeatIntervalMs: 25000,

  // Timeout settings - lebih toleran untuk koneksi lambat
  timeout: 30000,

  // Reconnection settings
  reconnectAfterMs: (tries: number) => {
    return Math.min(tries * 1000, 30000);
  },

  // Additional stability settings
  params: {
    eventsPerSecond: 10,
    heartbeatIntervalMs: 25000,
    timeout: 30000,
  }
} as const;

/**
 * Global channel management to prevent memory leaks
 */
class RealtimeChannelManager {
  private channels = new Map<string, any>();
  private client: SupabaseClient | null = null;
  private tableSubscribers = new Map<string, Set<string>>();

  setClient(client: SupabaseClient) {
    this.client = client;
  }

  createChannel(channelName: string, config: any, callback: (payload: any) => void) {
    if (!this.client) {
      console.warn("Supabase client not set in channel manager");
      return null;
    }

    // Remove existing channel if it exists
    this.removeChannel(channelName);

    try {
      console.log(`🔌 Creating realtime channel: ${channelName}`, {
        table: config.table,
        filter: config.filter,
        event: config.event
      });

      const channel = this.client
        .channel(channelName, {
          config: {
            // Enable private channels and improved security
            private: false, // Set to true if you need private channels
            presence: {
              key: channelName,
            },
          },
        })
        .on("postgres_changes", config, callback)
        .subscribe((status) => {
          console.log(`📊 Channel ${channelName} status: ${status}`);
          if (status === "SUBSCRIBED") {
            console.log(`✅ Realtime channel subscribed: ${channelName}`, {
              table: config.table,
              filter: config.filter
            });
          } else if (status === "CHANNEL_ERROR") {
            console.error(`❌ Realtime channel error: ${channelName}`, config);
            // Attempt to reconnect after error
            setTimeout(() => {
              console.log(`🔄 Retrying channel ${channelName} after error`);
              this.createChannel(channelName, config, callback);
            }, 5000);
          } else if (status === "TIMED_OUT") {
            console.warn(`⏱️ Realtime channel timeout: ${channelName}`, config);
            // Attempt to reconnect after timeout
            setTimeout(() => {
              console.log(`🔄 Retrying channel ${channelName} after timeout`);
              this.createChannel(channelName, config, callback);
            }, 3000);
          } else if (status === "CLOSED") {
            console.warn(`🔒 Realtime channel closed: ${channelName}`);
            // Clean up the closed channel
            this.channels.delete(channelName);
          }
        });

      this.channels.set(channelName, channel);
      return channel;
    } catch (error) {
      console.error(`Failed to create realtime channel ${channelName}:`, error);
      return null;
    }
  }

  removeChannel(channelName: string) {
    const existingChannel = this.channels.get(channelName);
    if (existingChannel && this.client) {
      try {
        this.client.removeChannel(existingChannel);
        this.channels.delete(channelName);

        // Clean up table subscribers tracking
        for (const [table, subscribers] of this.tableSubscribers.entries()) {
          subscribers.delete(channelName);
          if (subscribers.size === 0) {
            this.tableSubscribers.delete(table);
          }
        }

        console.log(`🗑️ Removed realtime channel: ${channelName}`);
      } catch (error) {
        console.error(`Failed to remove channel ${channelName}:`, error);
        // Force cleanup
        this.channels.delete(channelName);
      }
    }
  }

  removeAllChannels() {
    if (this.client) {
      this.channels.forEach((channel, name) => {
        this.client!.removeChannel(channel);
        console.log(`🗑️ Removed realtime channel: ${name}`);
      });
      this.channels.clear();
    }
  }

  getActiveChannels() {
    return Array.from(this.channels.keys());
  }

  getChannelsByTable(table: string) {
    return this.tableSubscribers.get(table) || new Set();
  }

  getDebugInfo() {
    return {
      totalChannels: this.channels.size,
      channelNames: Array.from(this.channels.keys()),
      tableSubscribers: Object.fromEntries(
        Array.from(this.tableSubscribers.entries()).map(([table, subscribers]) => [
          table,
          Array.from(subscribers),
        ])
      ),
    };
  }

  // Health check method to detect stale or disconnected channels
  healthCheck() {
    const staleChannels: string[] = [];

    this.channels.forEach((channel, name) => {
      if (channel.state === 'closed' || channel.state === 'errored') {
        staleChannels.push(name);
      }
    });

    if (staleChannels.length > 0) {
      console.warn(`Found ${staleChannels.length} stale channels:`, staleChannels);
      staleChannels.forEach(name => this.removeChannel(name));
    }

    return {
      healthy: staleChannels.length === 0,
      staleChannels,
      totalChannels: this.channels.size,
    };
  }
}

export const channelManager = new RealtimeChannelManager();