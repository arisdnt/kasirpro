import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

type Schema = Record<string, unknown>;

let client: SupabaseClient<Schema> | undefined;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClient<Schema>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    });
  }
  return client;
};
