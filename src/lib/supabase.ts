import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Console warning for developers if Vite env vars are missing
  // These are public values only — do not put service role keys here.
  // Example: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
  // This helps surface misconfiguration when the app boots.
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase client warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set.\n" +
      "If you are running locally, create a .env file at the project root with:\n" +
      "VITE_SUPABASE_URL=https://your-project.supabase.co\n" +
      "VITE_SUPABASE_ANON_KEY=<your_anon_key>\n"
  );
}

const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export default supabase;
