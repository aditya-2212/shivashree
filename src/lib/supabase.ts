import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Browser/public client — safe to use in Client Components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client — bypasses Row Level Security.
// Use ONLY in Server Components, API routes, and Server Actions.
// Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// The name of the Supabase Storage bucket that holds uploaded CMS images.
// Create this bucket in the Supabase dashboard with "Public" access.
export const UPLOAD_BUCKET = "uploads";
