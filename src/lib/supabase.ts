import { createClient } from "@supabase/supabase-js";

// ── Supabase Configuration ─────────────────────────────────────────────────
//
// To hand this project over to a new owner / new Supabase project:
//
//   1. Create a new Supabase project at https://supabase.com
//   2. Run the SQL in supabase/migrations/001_initial_schema.sql
//   3. Create an admin user in Supabase > Authentication > Users
//   4. Replace the two fallback values below with the new project's
//      URL and anon key (found in Project Settings > API)
//   5. Update VITE_CALENDLY_URL fallback in index.tsx, contact.tsx,
//      services.tsx to the new Calendly username
//   6. Update hello.kavaro@gmail.com references in Navbar.tsx,
//      Footer.tsx, and api.ts to the new business email
//
// The anon key is safe to commit — it is designed to be public.
// Supabase Row Level Security policies control what it can access.

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://ppdqofwkwyqsfqikeaiv.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZHFvZndrd3lxc2ZxaWtlYWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwODAzMjAsImV4cCI6MjA5NzY1NjMyMH0.5FPQDQxAMhq-6iOCvhXy28POvYOHqmaSCsn0nWWGeZ8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Database types ─────────────────────────────────────────────────────────

export type DbLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: "new" | "read" | "replied";
  email_sent: boolean;
  created_at: string;
};

export type DbNote = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export type DbBookedCall = {
  id: string;
  name: string | null;
  email: string | null;
  service: string | null;
  calendly_url: string;
  created_at: string;
};
