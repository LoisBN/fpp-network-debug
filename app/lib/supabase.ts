import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseConnectionStatus = {
  connected: boolean;
  error: string | null;
  hint: string | null;
};

/**
 * Check if Supabase is properly configured and reachable.
 * Returns an object with connection status and helpful debugging info.
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  // Check for placeholder/missing credentials
  if (supabaseUrl.includes("placeholder") || supabaseAnonKey === "placeholder-key") {
    return {
      connected: false,
      error: "Supabase credentials not configured",
      hint: "Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Get these from your Supabase project dashboard → Settings → API.",
    };
  }

  // Check URL format
  if (!supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("supabase.in")) {
    return {
      connected: false,
      error: "Invalid Supabase URL format",
      hint: `The URL should look like 'https://yourproject.supabase.co'. Current: ${supabaseUrl}`,
    };
  }

  // Try a simple query to test connection
  try {
    // This query will fail if not connected but gives us connection info
    const { error } = await supabase.from("_test_connection").select("*").limit(1);

    // A "relation does not exist" error means we ARE connected (just no table)
    if (error?.message?.includes("does not exist") || error?.code === "42P01") {
      return {
        connected: true,
        error: null,
        hint: null,
      };
    }

    // Permission errors also mean we're connected
    if (error?.code === "42501" || error?.message?.includes("permission denied")) {
      return {
        connected: true,
        error: null,
        hint: null,
      };
    }

    // If no error at all, we're connected
    if (!error) {
      return {
        connected: true,
        error: null,
        hint: null,
      };
    }

    // Other errors might indicate connection issues
    return {
      connected: false,
      error: error.message,
      hint: "Check your Supabase project status at supabase.com/dashboard. Is the project paused?",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      connected: false,
      error: `Connection failed: ${message}`,
      hint: "Check your network connection and verify the Supabase URL is correct. Look in DevTools Network tab for failed requests.",
    };
  }
}