import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Connects to the owner's external Supabase project. Set these in Vercel env vars.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

export const NOT_CONFIGURED =
  "Online booking isn't available right now. Please call us on 020 3198 4186.";
