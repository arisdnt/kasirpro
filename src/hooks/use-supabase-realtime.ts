/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { channelManager } from "@/lib/supabase-realtime-config";

export type RealtimeConfig = {
  schema?: string;
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
};

export function useSupabaseRealtime(
  channel: string,
  config: RealtimeConfig,
  callback: () => void,
  options?: { enabled?: boolean },
) {
  const callbackRef = useRef(callback);
  const configRef = useRef(config);
  const enabledRef = useRef(options?.enabled ?? true);

  // Update refs when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    enabledRef.current = options?.enabled ?? true;
  }, [options?.enabled]);

  useEffect(() => {
    const channelConfig = {
      schema: configRef.current.schema ?? "public",
      table: configRef.current.table,
      event: configRef.current.event ?? "*",
      filter: configRef.current.filter,
    };

    const wrappedCallback = (payload: any) => {
      console.log(`📡 Realtime event on ${channel}:`, {
        table: configRef.current.table,
        event: payload.eventType,
        new: payload.new?.id,
        old: payload.old?.id,
      });
      callbackRef.current();
    };

    // Use channel manager for better resource management
    if (enabledRef.current === false) {
      // Ensure any existing channel with this name is removed and do not create a new one
      channelManager.removeChannel(channel);
      return () => {
        // nothing
      };
    }

  channelManager.createChannel(channel, channelConfig, wrappedCallback as unknown as () => void);

    return () => {
      channelManager.removeChannel(channel);
    };
  }, [channel, config.table, config.schema, config.event, config.filter]);
}
