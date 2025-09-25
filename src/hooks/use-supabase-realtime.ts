/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";

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
) {
  useEffect(() => {
    const client = getSupabaseClient();
    const subscription = client
      .channel(channel)
      .on(
        "postgres_changes" as any,
        {
          schema: config.schema ?? "public",
          table: config.table,
          event: config.event ?? "*",
          filter: config.filter,
        } as any,
        callback,
      )
      .subscribe();

    return () => {
      client.removeChannel(subscription);
    };
  }, [channel, config.event, config.filter, config.schema, config.table, callback]);
}
