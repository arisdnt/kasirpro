const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const enableQuickLogin = import.meta.env.VITE_ENABLE_QUICK_LOGIN === "true";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase credentials are missing in environment variables");
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  enableQuickLogin,
} as const;
