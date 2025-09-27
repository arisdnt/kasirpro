/**
 * Enhanced Supabase Realtime Configuration
 * Optimized for better performance and reliability
 */

import { SupabaseClient } from "@supabase/supabase-js";

export const ENHANCED_REALTIME_CONFIG = {
  // Increase events per second for better responsiveness
  eventsPerSecond: 10,

  // Connection retry settings
  heartbeatIntervalMs: 30000,

  // Timeout settings
  timeout: 20000,

  // Reconnection settings
  reconnectAfterMs: (tries: number) => {
    return Math.min(tries * 1000, 30000);
  },
} as const;

/**
 * Global channel management to prevent memory leaks
 */
class RealtimeChannelManager {
  private channels = new Map<string, any>();
  private client: SupabaseClient | null = null;

  setClient(client: SupabaseClient) {
    this.client = client;
  }

  createChannel(channelName: string, config: any, callback: () => void) {
    if (!this.client) {
      console.warn("Supabase client not set in channel manager");
      return null;
    }

    // Remove existing channel if it exists
    this.removeChannel(channelName);

    const channel = this.client
      .channel(channelName)
      .on("postgres_changes", config, callback)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`✅ Realtime channel subscribed: ${channelName}`);
        } else if (status === "CHANNEL_ERROR") {
          console.error(`❌ Realtime channel error: ${channelName}`);
        } else if (status === "TIMED_OUT") {
          console.warn(`⏱️ Realtime channel timeout: ${channelName}`);
        }
      });

    this.channels.set(channelName, channel);
    return channel;
  }

  removeChannel(channelName: string) {
    const existingChannel = this.channels.get(channelName);
    if (existingChannel && this.client) {
      this.client.removeChannel(existingChannel);
      this.channels.delete(channelName);
      console.log(`🗑️ Removed realtime channel: ${channelName}`);
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
}

export const channelManager = new RealtimeChannelManager();