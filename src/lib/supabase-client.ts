import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
import { ENHANCED_REALTIME_CONFIG, channelManager } from "./supabase-realtime-config";

type Schema = Record<string, unknown>;

let client: SupabaseClient<Schema> | undefined;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClient<Schema>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      // Configure Realtime using documented RealtimeClientOptions
      // Ref: RealtimeClientOptions (heartbeatIntervalMs, timeout, reconnectAfterMs, params)
      realtime: {
        heartbeatIntervalMs: ENHANCED_REALTIME_CONFIG.heartbeatIntervalMs,
        timeout: ENHANCED_REALTIME_CONFIG.timeout,
        reconnectAfterMs: ENHANCED_REALTIME_CONFIG.reconnectAfterMs,
        // Optional connection params (e.g., log_level) can be added here when needed
        params: {},
      },
    });

    // Initialize channel manager with client
    channelManager.setClient(client);

    // Log realtime status for debugging (API compatibility guarded)
    try {
      type LegacyRealtime = {
        onOpen?: (cb: () => void) => void;
        onClose?: (cb: () => void) => void;
        onError?: (cb: (err: unknown) => void) => void;
      };
      type EventEmitterRealtime = {
        on?: (event: string, cb: (...args: unknown[]) => void) => void;
      };
      const rt = client.realtime as unknown as Partial<LegacyRealtime & EventEmitterRealtime>;
      if (typeof rt.onOpen === "function") {
        rt.onOpen(() => {
          console.log("🔌 Supabase Realtime connected");
        });
      } else if (typeof rt.on === "function") {
        rt.on("open", () => console.log("🔌 Supabase Realtime connected"));
      }

      if (typeof rt.onClose === "function") {
        rt.onClose(() => {
          console.log("🔌 Supabase Realtime disconnected");
        });
      } else if (typeof rt.on === "function") {
        rt.on("close", () => console.log("🔌 Supabase Realtime disconnected"));
      }

      if (typeof rt.onError === "function") {
        rt.onError((error: unknown) => {
          console.error("❌ Supabase Realtime error:", error);
        });
      } else if (typeof rt.on === "function") {
        rt.on("error", (error: unknown) => console.error("❌ Supabase Realtime error:", error));
      }
    } catch {
      // Silently ignore if realtime hooks are not supported; channelManager still works
    }
  }
  return client;
};
